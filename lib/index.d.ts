/// <reference types="node" />
/// <reference types="bluebird" />
import * as EventEmitter from 'events';
import * as Promise from 'bluebird';
/**
 * `PlurkClient` is a class that wraps all plurk API call and handles comet channel when enabled.
 * It inherits from Node.js's [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) class.
 */
export declare class PlurkClient extends EventEmitter implements IPlurkClientEventEmitter {
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
    private _cometUrl;
    private _pollCometRequest;
    /**
     * Constructor
     * @param consumerKey Consumer token, can be obtain one from Plurk App console.
     * @param consumerSecret Consumer token secret, should be together with consumer token.
     * @param token Oauth access token, optional.
     * You may assign it here or use `getRequestToken()` and then `getAccessToken()`
     * to obtain one from user with oauth authentication flow.
     * @param tokenSecret Oauth access token secret, optional. Also this should be come with access token.
     */
    constructor(consumerKey: string, consumerSecret: string, token?: string, tokenSecret?: string);
    /**
     * Get oauth request token (temporary) for user to authenticate.
     * It will assigns `token` and `tokenSecret` of current instance for further process.
     * @param callback Redirect URL after authenticate success, can be omitted if this is not a web app.
     * @return {PromiseLike.<this>} Current plurk client instance.
     */
    getRequestToken(callback?: string): Promise<this>;
    /**
     * Get oauth access token (permanent) for requesting other API.
     * It will assigns `token` and `tokenSecret` of current instance.
     * Should be called once users' verifier has been received.
     * @param verifier The oauth verifier received from the user.
     * @return {PromiseLike.<this>} Current plurk client instance.
     */
    getAccessToken(verifier: string): Promise<this>;
    /**
     * Make a post request API call to Plurk (as recommended in the documentation),
     * it will uses the oauth token provided in the client instance if available.
     * [Plurk API Reference](https://www.plurk.com/API)
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
    request(api: string, parameters?: any): Promise<any>;
    /**
     * Start long poll from comet channel, it auto handles request for comet server
     * URL and it will auto keep polling until you stops it.
     */
    startComet(): void;
    /**
     * Stops long poll from comet channel.
     */
    stopComet(): void;
    /**
     * Restart long poll from comet channel.
     * Normally this method is automatically called while polling.
     */
    pollComet(): void;
    /**
     * User authentication URL. Should be inform user to navigate to this URL
     * once the promise of `getRequestToken(...)` has been resolved.
     */
    readonly authPage: string;
    /**
     * Mobile version of user authentication URL.
     * Users may navigate to this URL instead of `authPage` if they are using smartphones.
     */
    readonly mobileAuthPage: string;
    private _getOAuthParams(params?);
    private _setOAuthParams(body);
    private static _pollComet(client);
    private static _parseResponse(key, value);
}
export interface IPlurkClientEventEmitter {
    /**
     * Event callback on comet channel responses.
     * This will be called even on comet channel does not returns any new push.
     * This event fires before any other comet channel events.
     * The fields are already converted to JavaScript types just like
     * the resolved promise in `request()`.
     */
    on(event: 'comet', listener: (comet: any) => void): this;
    /**
     * General error callback from comet channel.
     */
    on(event: 'error', listener: (err: any) => void): this;
    /**
     * Event callback on comet channel receives each data push.
     * It is already filtered by push event types as you defined in `event` parameter
     * and converted to JavaScript types just like the resolved promise in `request()`.
     * For more info please check out
     * [comet channel specification](https://www.plurk.com/API#Comet_channel_specification)
     * section in API reference.
     * @param event Can be `new_plurk`, `new_response` or any others which supported.
     */
    on(event: string, listener: (data: any) => void): this;
}
/**
 * `limitTo` is an utility namespace that encodes and decodes Plurk limitTo
 * field format to and from array which looks like this: `|1||2|`.
 */
export declare namespace limitTo {
    function parse(src: number[]): number[];
    /**
     * Parses the limitTo format to array
     * @param src Source string.
     * @return {number[] | undefined}
     */
    function parse(src: string): number[] | undefined;
    /**
     * Converts array of Plurk IDs to limitTo format.
     * @param src Source array of Plurk IDs.
     * @return {string}
     */
    function stringify(src: number[]): string;
}
/**
 * `base36` is an utility that converts base36 string to or from number.
 */
export declare namespace base36 {
    /**
     * Base36 string to number.
     * @param val Base36 string.
     * @return {number}
     */
    function decode(val: string): number;
    /**
     * Number to base36 string.
     * @param val Number.
     * @return {string}
     */
    function encode(val: number): string;
}
/**
 * `urlmatch` is an utility that extracts an user or a plurk's id from URL.
 */
export declare namespace urlmatch {
    /**
     * Extracts plurk id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {string | undefined}
     */
    function plurk(url: string, decode: false): string | undefined;
    /**
     * Extracts plurk id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {number | undefined}
     */
    function plurk(url: string, decode: true): number | undefined;
    /**
     * Extracts user id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {string | undefined}
     */
    function user(url: string, decode: false): string | undefined;
    /**
     * Extracts user id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {number | undefined}
     */
    function user(url: string, decode: true): number | undefined;
}
