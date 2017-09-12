'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var querystring_1 = require("querystring");
var EventEmitter = require("events");
var request = require("request-promise");
var endPoint = 'https://www.plurk.com/';
var requestTokenUrl = endPoint + "OAuth/request_token";
var accessTokenUrl = endPoint + "OAuth/access_token";
var pathMatcher = /^\/?(?:APP\/)?(.+)$/;
var numberMatcher = /[0-9]+/g;
var plurkUrlMatcher = /plurk\.com\/(m\/)?p\/([0-9a-z]+)(\/#)?$/;
var plurkUserMatcher = /plurk\.com\/(m\/u\/)?([0-9a-zA-Z_]+)(\/#)?$/;
var plurkLimitToMatcher = /^(?:\|[0-9]+\|)*$/;
/**
 * `PlurkClient` is a class that wraps all plurk API call and handles comet channel when enabled.
 * It inherits from Node.js's [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) class.
 */
var PlurkClient = /** @class */ (function (_super) {
    __extends(PlurkClient, _super);
    /**
     * Constructor
     * @param consumerKey Consumer token, can be obtain one from Plurk App console.
     * @param consumerSecret Consumer token secret, should be together with consumer token.
     * @param token Oauth access token, optional.
     * You may assign it here or use `getRequestToken()` and then `getAccessToken()`
     * to obtain one from user with oauth authentication flow.
     * @param tokenSecret Oauth access token secret, optional. Also this should be come with access token.
     */
    function PlurkClient(consumerKey, consumerSecret, token, tokenSecret) {
        if (token === void 0) { token = ''; }
        if (tokenSecret === void 0) { tokenSecret = ''; }
        var _this = _super.call(this) || this;
        _this.consumerKey = consumerKey;
        _this.consumerSecret = consumerSecret;
        _this.token = token;
        _this.tokenSecret = tokenSecret;
        return _this;
    }
    /**
     * Get oauth request token (temporary) for user to authenticate.
     * It will assigns `token` and `tokenSecret` of current instance for further process.
     * @param callback Redirect URL after authenticate success, can be omitted if this is not a web app.
     * @return {PromiseLike.<this>} Current plurk client instance.
     */
    PlurkClient.prototype.getRequestToken = function (callback) {
        var _this = this;
        if (callback === void 0) { callback = ''; }
        return request({
            method: 'POST', url: requestTokenUrl,
            oauth: this._getOAuthParams({ callback: callback })
        })
            .then(function (body) { return _this._setOAuthParams(body); });
    };
    /**
     * Get oauth access token (permanent) for requesting other API.
     * It will assigns `token` and `tokenSecret` of current instance.
     * Should be called once users' verifier has been received.
     * @param verifier The oauth verifier received from the user.
     * @return {PromiseLike.<this>} Current plurk client instance.
     */
    PlurkClient.prototype.getAccessToken = function (verifier) {
        var _this = this;
        return request({
            method: 'POST', url: accessTokenUrl,
            oauth: this._getOAuthParams({ verifier: verifier })
        })
            .then(function (body) { return _this._setOAuthParams(body); });
    };
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
    PlurkClient.prototype.request = function (api, parameters) {
        var resolved = pathMatcher.exec(api);
        if (!resolved || resolved.length < 2)
            throw new Error("Invalid api path '" + api + "'");
        var form = {};
        var useFormData = false;
        if (parameters)
            for (var key in parameters) {
                var value = parameters[key];
                switch (typeof value) {
                    case 'undefined':
                    case 'function':
                    case 'symbol': break;
                    case 'object':
                        if (value instanceof Date)
                            form[key] = value.toISOString();
                        else if (value && (value instanceof Buffer || typeof value.pipe === 'function')) {
                            form[key] = value;
                            useFormData = true;
                        }
                        else
                            form[key] = JSON.stringify(value);
                        break;
                    default:
                        form[key] = value;
                        break;
                }
            }
        return request((_a = {
                url: endPoint + "APP/" + resolved[1]
            },
            _a[useFormData ? 'formData' : 'form'] = form,
            _a.method = 'POST',
            _a.json = true,
            _a.jsonReviver = PlurkClient._parseResponse,
            _a.oauth = this._getOAuthParams(),
            _a));
        var _a;
    };
    /**
     * Start long poll from comet channel, it auto handles request for comet server
     * URL and it will auto keep polling until you stops it.
     */
    PlurkClient.prototype.startComet = function () {
        var _this = this;
        if (this.cometStarted)
            return;
        this.cometStarted = true;
        this.request('Realtime/getUserChannel')
            .then(function (data) {
            if (!data.comet_server)
                throw new Error('Comet URL not found');
            _this._cometUrl = url_1.parse(data.comet_server, true);
            if (_this.cometStarted)
                _this.pollComet();
        })
            .catch(function (err) {
            _this.cometStarted = false;
            _this.emit('error', err);
        });
    };
    /**
     * Stops long poll from comet channel.
     */
    PlurkClient.prototype.stopComet = function () {
        if (!this.cometStarted)
            return;
        this.cometStarted = false;
        if (this._pollCometRequest) {
            this._pollCometRequest.cancel();
            delete this._pollCometRequest;
        }
    };
    /**
     * Restart long poll from comet channel.
     * Normally this method is automatically called while polling.
     */
    PlurkClient.prototype.pollComet = function () {
        var _this = this;
        if (this._pollCometRequest)
            this._pollCometRequest.cancel();
        if (!this.cometStarted)
            return;
        this._pollCometRequest = request({
            url: this._cometUrl, timeout: 60000,
            agentOptions: { rejectUnauthorized: false }
        })
            .then(function (response) {
            var parsedResponse = JSON.parse(response.substring(response.indexOf('{'), response.lastIndexOf('}') + 1), PlurkClient._parseResponse);
            _this.emit('comet', response);
            var data = parsedResponse.data, new_offset = parsedResponse.new_offset;
            _this._cometUrl.query.offset = new_offset;
            delete _this._cometUrl.search;
            if (data && data.length)
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var entry = data_1[_i];
                    if (entry && entry.type)
                        _this.emit(entry.type, entry);
                }
            process.nextTick(PlurkClient._pollComet, _this);
        })
            .catch(function (err) {
            if (_this.stopCometOnError)
                _this.cometStarted = false;
            else
                process.nextTick(PlurkClient._pollComet, _this);
            _this.emit('error', err);
        })
            .finally(function () {
            delete _this._pollCometRequest;
        });
    };
    Object.defineProperty(PlurkClient.prototype, "authPage", {
        /**
         * User authentication URL. Should be inform user to navigate to this URL
         * once the promise of `getRequestToken(...)` has been resolved.
         */
        get: function () {
            return this.token ? endPoint + "OAuth/authorize?oauth_token=" + this.token : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlurkClient.prototype, "mobileAuthPage", {
        /**
         * Mobile version of user authentication URL.
         * Users may navigate to this URL instead of `authPage` if they are using smartphones.
         */
        get: function () {
            return this.token ? endPoint + "m/authorize?oauth_token=" + this.token : '';
        },
        enumerable: true,
        configurable: true
    });
    PlurkClient.prototype._getOAuthParams = function (params) {
        if (params === void 0) { params = {}; }
        params.consumer_key = this.consumerKey;
        params.consumer_secret = this.consumerSecret;
        if (this.token)
            params.token = this.token;
        if (this.tokenSecret)
            params.token_secret = this.tokenSecret;
        return params;
    };
    PlurkClient.prototype._setOAuthParams = function (body) {
        var val = querystring_1.parse(body);
        if (val.oauth_token)
            this.token = val.oauth_token;
        if (val.oauth_token_secret)
            this.tokenSecret = val.oauth_token_secret;
        return this;
    };
    PlurkClient._pollComet = function (client) {
        return client.pollComet();
    };
    PlurkClient._parseResponse = function (key, value) {
        switch (key) {
            case 'limited_to':
                if (typeof value === 'string' &&
                    plurkLimitToMatcher.test(value))
                    return limitTo.parse(value);
                break;
            case 'date_of_birth':
            case 'posted':
            case 'now':
            case 'issued':
                if (typeof value === 'string')
                    return new Date(value);
                break;
            case 'timestamp':
                if (typeof value === 'number')
                    return new Date(value * 1000);
                break;
        }
        return value;
    };
    return PlurkClient;
}(EventEmitter));
exports.PlurkClient = PlurkClient;
/**
 * `limitTo` is an utility namespace that encodes and decodes Plurk limitTo
 * field format to and from array which looks like this: `|1||2|`.
 */
var limitTo;
(function (limitTo) {
    function parse(src) {
        if (Array.isArray(src))
            return src;
        if (typeof src === 'string') {
            var matches = src.match(numberMatcher);
            if (matches)
                return matches.map(function (id) { return parseInt(id, 10); });
        }
    }
    limitTo.parse = parse;
    /**
     * Converts array of Plurk IDs to limitTo format.
     * @param src Source array of Plurk IDs.
     * @return {string}
     */
    function stringify(src) {
        return src.length ? "|" + src.join('||') + "|" : '';
    }
    limitTo.stringify = stringify;
})(limitTo = exports.limitTo || (exports.limitTo = {}));
/**
 * `base36` is an utility that converts base36 string to or from number.
 */
var base36;
(function (base36) {
    /**
     * Base36 string to number.
     * @param val Base36 string.
     * @return {number}
     */
    function decode(val) {
        return parseInt(val, 36);
    }
    base36.decode = decode;
    /**
     * Number to base36 string.
     * @param val Number.
     * @return {string}
     */
    function encode(val) {
        return isNaN(val) ? '' : val.toString(36);
    }
    base36.encode = encode;
})(base36 = exports.base36 || (exports.base36 = {}));
/**
 * `urlmatch` is an utility that extracts an user or a plurk's id from URL.
 */
var urlmatch;
(function (urlmatch) {
    function plurk(url, decode) {
        var result = plurkUrlMatcher.exec(url);
        if (result) {
            var id = result[2];
            if (id)
                return decode ? base36.decode(id) : id;
        }
    }
    urlmatch.plurk = plurk;
    function user(url, decode) {
        var result = plurkUserMatcher.exec(url);
        if (result) {
            var id = result[2];
            if (id)
                return decode ? base36.decode(id) : id;
        }
    }
    urlmatch.user = user;
})(urlmatch = exports.urlmatch || (exports.urlmatch = {}));
