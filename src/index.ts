'use strict';
import { parse as parseUrl, Url } from 'url';
import { parse as parseBody } from 'querystring';
import * as EventEmitter from 'events';
import * as Promise from 'bluebird';
import { OAuthOptions } from 'request';
import * as request from 'request-promise';

const endPoint: string = 'https://www.plurk.com/';
const requestTokenUrl: string = `${endPoint}OAuth/request_token`;
const accessTokenUrl: string = `${endPoint}OAuth/access_token`;

const pathMatcher: RegExp = /^\/?(?:APP\/)?(.+)$/;
const numberMatcher: RegExp = /[0-9]+/g;
const plurkUrlMatcher: RegExp = /plurk\.com\/(m\/)?p\/([0-9a-z]+)(\/#)?$/;
const plurkUserMatcher: RegExp = /plurk\.com\/(m\/u\/)?([0-9a-zA-Z_]+)(\/#)?$/;
const plurkLimitToMatcher: RegExp = /^(?:\|[0-9]+\|)*$/;

/**
 * `PlurkClient` is a class that wraps all plurk API call and handles comet channel when enabled.
 * It inherits from Node.js's [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) class.
 */
export class PlurkClient extends EventEmitter implements IPlurkClientEventEmitter {
  /**
   * Consumer token, can be obtain one from Plurk App console.
   */
  consumerKey: string;
  /**
   * Consumer token secret, should be together with consumer token.
   */
  consumerSecret: string;
  /**
   * OAuth access token or request token of current client.
   */
  token: string;
  /**
   * OAuth token secret of current client.
   */
  tokenSecret: string;
  /**
   * Flag indicates if the commet channel is started.
   */
  cometStarted: boolean;
  /**
   * Boolean field, set to `true` to automatic stops the
   * comet channel when any error has been thrown,
   * or else it will keep reconnect even have errors.
   */
  stopCometOnError: boolean;
  private _cometUrl: Url;
  private _pollCometRequest: Promise<any>;

  /**
   * Constructor
   * @param consumerKey Consumer token, can be obtain one from Plurk App console.
   * @param consumerSecret Consumer token secret, should be together with consumer token.
   * @param token Oauth access token, optional.
   * You may assign it here or use `getRequestToken()` and then `getAccessToken()`
   * to obtain one from user with oauth authentication flow.
   * @param tokenSecret Oauth access token secret, optional. Also this should be come with access token.
   */
  constructor(consumerKey: string, consumerSecret: string,
    token: string = '', tokenSecret: string = '') {
    super();
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.token = token;
    this.tokenSecret = tokenSecret;
  }

  /**
   * Get oauth request token (temporary) for user to authenticate.
   * It will assigns `token` and `tokenSecret` of current instance for further process.
   * @param callback Redirect URL after authenticate success, can be omitted if this is not a web app.
   * @return {PromiseLike.<this>} Current plurk client instance.
   */
  getRequestToken(callback: string = ''): Promise<this> {
    return request({
      method: 'POST', url: requestTokenUrl,
      oauth: this._getOAuthParams({ callback })
    })
    .then((body: string): this => this._setOAuthParams(body));
  }

  /**
   * Get oauth access token (permanent) for requesting other API.
   * It will assigns `token` and `tokenSecret` of current instance.
   * Should be called once users' verifier has been received.
   * @param verifier The oauth verifier received from the user.
   * @return {PromiseLike.<this>} Current plurk client instance.
   */
  getAccessToken(verifier: string): Promise<this> {
    return request({
      method: 'POST', url: accessTokenUrl,
      oauth: this._getOAuthParams({ verifier })
    })
    .then((body: string): this => this._setOAuthParams(body));
  }

  /**
   * Make a post request API call to Plurk (as recommended in the documentation),
   * it will uses the oauth token provided in the client instance if available.
   * @param api API path as written in the documentation.
   * `APP/` prefix can be omitted.
   * @param parameters Object hash of the parameters, can be omitted if no parameters.
   * Also it will automatically converts `Date` object entries to
   * [ISO8601 string](https://en.wikipedia.org/wiki/ISO_8601) and
   * `Array` object entries to JSON string before request.
   * You may also pass Node.js native `Buffer` or `Stream` values for image uploading APIs
   * such as [`/APP/Timeline/uploadPicture`](https://www.plurk.com/API#/APP/Timeline/uploadPicture).
   * @return {Promise.<?>} The parsed JSON data respond from Plurk.
   * It will auto converts all known date/time fields to `Date` objects
   * and `limited_to` field to array of numbers.
   */
  request(api: string, parameters?: any): Promise<any> {
    const resolved: string[] | null = pathMatcher.exec(api);
    if(!resolved || resolved.length < 2)
      throw new Error(`Invalid api path '${api}'`);
    const form: any = {};
    let useFormData: boolean = false;
    if(parameters)
      for(let key in parameters) {
        const value: any = parameters[key];
        switch(typeof value) {
          case 'undefined': case 'function': case 'symbol': break;
          case 'object':
            if(value instanceof Date)
              form[key] = value.toISOString();
            else if(value && (value instanceof Buffer || typeof value.pipe === 'function')) {
              form[key] = value;
              useFormData = true;
            } else
              form[key] = JSON.stringify(value);
            break;
          default:
            form[key] = value;
            break;
        }
      }
    return request({
      url: `${endPoint}APP/${resolved[1]}`,
      [useFormData ? 'formData' : 'form']: form,
      method: 'POST', json: true,
      jsonReviver: PlurkClient._parseResponse,
      oauth: this._getOAuthParams()
    });
  }

  /**
   * Start long poll from comet channel, it auto handles request for comet server
   * URL and it will auto keep polling until you stops it.
   */
  startComet(): void {
    if(this.cometStarted) return;
    this.cometStarted = true;
    this.request('Realtime/getUserChannel')
    .then((data: any): void => {
      if(!data.comet_server)
        throw new Error('Comet URL not found');
      this._cometUrl = parseUrl(data.comet_server, true);
      if(this.cometStarted) this.pollComet();
    })
    .catch((err: any): void => {
      this.cometStarted = false;
      this.emit('error', err);
    });
  }

  /**
   * Stops long poll from comet channel.
   */
  stopComet(): void {
    if(!this.cometStarted) return;
    this.cometStarted = false;
    if(this._pollCometRequest) {
      this._pollCometRequest.cancel();
      delete this._pollCometRequest;
    }
  }

  /**
   * Restart long poll from comet channel.
   * Normally this method is automatically called while polling.
   */
  pollComet(): void {
    if(this._pollCometRequest)
      this._pollCometRequest.cancel();
    if(!this.cometStarted) return;
    this._pollCometRequest = request({
      url: this._cometUrl, timeout: 60000,
      agentOptions: { rejectUnauthorized: false }
    })
    .then((response: string): void => {
      const parsedResponse: any = JSON.parse(response.substring(
        response.indexOf('{'),
        response.lastIndexOf('}') + 1
      ), PlurkClient._parseResponse);
      this.emit('comet', response);
      const { data, new_offset } = parsedResponse;
      this._cometUrl.query.offset = new_offset;
      delete this._cometUrl.search;
      if(data && data.length)
        for(const entry of data)
          if(entry && entry.type)
            this.emit(entry.type, entry);
      process.nextTick(PlurkClient._pollComet, this);
    })
    .catch((err: any): void => {
      if(this.stopCometOnError)
        this.cometStarted = false;
      else
        process.nextTick(PlurkClient._pollComet, this);
      this.emit('error', err);
    })
    .finally((): void => {
      delete this._pollCometRequest;
    });
  }

  /**
   * User authentication URL. Should be inform user to navigate to this URL
   * once the promise of `getRequestToken(...)` has been resolved.
   */
  get authPage(): string {
    return this.token ? `${endPoint}OAuth/authorize?oauth_token=${this.token}` : '';
  }

  /**
   * Mobile version of user authentication URL.
   * Users may navigate to this URL instead of `authPage` if they are using smartphones.
   */
  get mobileAuthPage(): string {
    return this.token ? `${endPoint}m/authorize?oauth_token=${this.token}` : '';
  }

  private _getOAuthParams(params: OAuthOptions = {}): OAuthOptions {
    params.consumer_key = this.consumerKey;
    params.consumer_secret = this.consumerSecret;
    if(this.token)
      params.token = this.token;
    if(this.tokenSecret)
      params.token_secret = this.tokenSecret;
    return params;
  }

  private _setOAuthParams(body: string): this {
    const val: any = parseBody(body);
    if(val.oauth_token)
      this.token = val.oauth_token;
    if(val.oauth_token_secret)
      this.tokenSecret = val.oauth_token_secret;
    return this;
  }
  
  private static _pollComet(client: PlurkClient): void {
    return client.pollComet();
  }

  private static _parseResponse(key: string, value: any): any {
    switch(key) {
      case 'limited_to':
        if(typeof value === 'string' &&
          plurkLimitToMatcher.test(value))
          return limitTo.parse(value);
        break;
      case 'date_of_birth':
      case 'posted':
      case 'now':
      case 'issued':
        if(typeof value === 'string')
          return new Date(value);
        break;
      case 'timestamp':
        if(typeof value === 'number')
          return new Date(value * 1000);
        break;
    }
    return value;
  }
}

export interface IPlurkClientEventEmitter {
  /**
   * Event callback on comet channel responses.
   * This will be called even on comet channel does not returns any new push.
   * This event fires before any other comet channel events.
   */
  on(event: 'comet', listener: (comet: any) => void): this;
  /**
   * General error callback from comet channel.
   */
  on(event: 'error', listener: (err: any) => void): this;
  /**
   * Event callback on comet channel receives each data push.
   * @param event Can be `new_plurk`, `new_response` or any others.
   */
  on(event: string, listener: (data: any) => void): this;
}

/**
 * `limitTo` is an utility namespace that encodes and decodes Plurk limitTo
 * field format to and from array which looks like this: `|1||2|`.
 */
export namespace limitTo {
  export function parse(src: number[]): number[];
  /**
   * Parses the limitTo format to array
   * @param src Source string.
   * @return {number[] | undefined}
   */
  export function parse(src: string): number[] | undefined;
  export function parse(src: number[] | string): number[] | undefined {
    if(Array.isArray(src)) return src;
    if(typeof src === 'string') {
      const matches = src.match(numberMatcher);
      if(matches) return matches.map(
        (id: string): number => parseInt(id, 10));
    }
  }

  /**
   * Converts array of Plurk IDs to limitTo format.
   * @param src Source array of Plurk IDs.
   * @return {string}
   */
  export function stringify(src: number[]): string {
    return src.length ? `|${src.join('||')}|` : '';
  }
}

/**
 * `base36` is an utility that converts base36 string to or from number.
 */
export namespace base36 {
  /**
   * Base36 string to number.
   * @param val Base36 string.
   * @return {number}
   */
  export function decode(val: string): number {
    return parseInt(val, 36);
  }

  /**
   * Number to base36 string.
   * @param val Number.
   * @return {string}
   */
  export function encode(val: number): string {
    return isNaN(val) ? '' : val.toString(36);
  }
}

/**
 * `urlmatch` is an utility that extracts an user or a plurk's id from URL.
 */
export namespace urlmatch {
  /**
   * Extracts plurk id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {string | undefined}
   */
  export function plurk(url: string, decode: false): string | undefined;
  /**
   * Extracts plurk id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {number | undefined}
   */
  export function plurk(url: string, decode: true): number | undefined;
  export function plurk(url: string, decode: boolean): string | number | undefined {
    const result: string[] | null = plurkUrlMatcher.exec(url);
    if(result) {
      const id: string = result[2];
      if(id) return decode ? base36.decode(id) : id;
    }
  }

  /**
   * Extracts user id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {string | undefined}
   */
  export function user(url: string, decode: false): string | undefined;
  /**
   * Extracts user id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {number | undefined}
   */
  export function user(url: string, decode: true): number | undefined;
  export function user(url: string, decode: boolean): string | number | undefined {
    const result: string[] | null = plurkUserMatcher.exec(url);
    if(result) {
      const id: string = result[2];
      if(id) return decode ? base36.decode(id) : id;
    }
  }
}
