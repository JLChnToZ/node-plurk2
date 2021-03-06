/// <reference types="node" />
import { EventEmitter } from 'events';
import * as request from 'request-promise';
import { limitTo } from './limit-to';
import { APIParameters } from './api-parameters';
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
    /**
     * Boolean field, set to `true` to populate the user data
     * to specific fields. For example, response data in comet channel
     * will have a `user` field with user details in it if detail of `user_id`
     * is found in raw channel response.
     */
    populateUsers: boolean;
    private _cometUrl?;
    private _pollCometRequest?;
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
     * Also, the response will return some timing measurement info for the call, for details please see
     * [the usage of the request package](https://github.com/request/request/blob/master/README.md)
     */
    request<K extends keyof APIParameters>(api: K, parameters?: APIParameters[K][0]): request.RequestPromise & PromiseLike<APIParameters[K][1]>;
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
    get authPage(): string;
    /**
     * Mobile version of user authentication URL.
     * Users may navigate to this URL instead of `authPage` if they are using smartphones.
     */
    get mobileAuthPage(): string;
    private _getOAuthParams;
    private _setOAuthParams;
}
export interface IPlurkClientEventEmitter extends NodeJS.EventEmitter {
    /**
     * Event callback on comet channel responses.
     * This will be called even on comet channel does not returns any new push.
     * This event fires before any other comet channel events.
     * The fields are already converted to JavaScript types just like
     * the resolved promise in `request()`.
     */
    on(event: 'comet', listener: (comet: any, raw: string) => void): this;
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
export * from './urlwatch';
export * from './base36';
export { limitTo };
