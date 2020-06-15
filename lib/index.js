'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitTo = exports.PlurkClient = void 0;
var url_1 = require("url");
var querystring_1 = require("querystring");
var events_1 = require("events");
var request = require("request-promise");
var limit_to_1 = require("./limit-to");
Object.defineProperty(exports, "limitTo", { enumerable: true, get: function () { return limit_to_1.limitTo; } });
var endPoint = 'https://www.plurk.com/';
var requestTokenUrl = endPoint + "OAuth/request_token";
var accessTokenUrl = endPoint + "OAuth/access_token";
var pathMatcher = /^\/?(?:APP\/)?(.+)$/;
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
        /**
         * Flag indicates if the commet channel is started.
         */
        _this.cometStarted = false;
        /**
         * Boolean field, set to `true` to automatic stops the
         * comet channel when any error has been thrown,
         * or else it will keep reconnect even have errors.
         */
        _this.stopCometOnError = false;
        /**
         * Boolean field, set to `true` to populate the user data
         * to specific fields. For example, response data in comet channel
         * will have a `user` field with user details in it if detail of `user_id`
         * is found in raw channel response.
         */
        _this.populateUsers = false;
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
        if (callback === void 0) { callback = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request({
                            method: 'POST', url: requestTokenUrl,
                            oauth: this._getOAuthParams({ callback: callback })
                        })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this._setOAuthParams(body)];
                }
            });
        });
    };
    /**
     * Get oauth access token (permanent) for requesting other API.
     * It will assigns `token` and `tokenSecret` of current instance.
     * Should be called once users' verifier has been received.
     * @param verifier The oauth verifier received from the user.
     * @return {PromiseLike.<this>} Current plurk client instance.
     */
    PlurkClient.prototype.getAccessToken = function (verifier) {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request({
                            method: 'POST', url: accessTokenUrl,
                            oauth: this._getOAuthParams({ verifier: verifier })
                        })];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, this._setOAuthParams(body)];
                }
            });
        });
    };
    PlurkClient.prototype.request = function (api, parameters) {
        var _a;
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
            _a.jsonReviver = PlurkClientUtils.parseResponse,
            _a.headers = {
                'Content-Type': useFormData ?
                    'multipart/form-data' :
                    'application/x-www-form-urlencoded',
            },
            _a.oauth = this._getOAuthParams(),
            _a.time = true,
            _a.transform = transformWithTiming,
            _a));
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
        if (!this._cometUrl)
            throw new Error('Unknown comet url');
        this._pollCometRequest = request({
            url: this._cometUrl, timeout: 60000,
            agentOptions: { rejectUnauthorized: false }
        })
            .then(function (response) {
            var e_1, _a;
            var _b;
            if (!_this._cometUrl)
                throw new Error('Unknown comet url');
            var parsedResponse = JSON.parse(response.substring(response.indexOf('{'), response.lastIndexOf('}') + 1), PlurkClientUtils.parseResponse);
            _this.emit('comet', parsedResponse, response);
            var data = parsedResponse.data, user = parsedResponse.user, new_offset = parsedResponse.new_offset;
            if (((_b = _this._cometUrl) === null || _b === void 0 ? void 0 : _b.query) && typeof _this._cometUrl.query !== 'string')
                _this._cometUrl.query.offset = new_offset;
            delete _this._cometUrl.search;
            if (data && data.length)
                try {
                    for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                        var entry = data_1_1.value;
                        if (_this.populateUsers && user)
                            PlurkClientUtils.populateUsers(entry, user);
                        if (entry && entry.type)
                            _this.emit(entry.type, entry);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            process.nextTick(PlurkClientUtils.pollComet, _this);
        })
            .catch(function (err) {
            if (_this.stopCometOnError)
                _this.cometStarted = false;
            else
                process.nextTick(PlurkClientUtils.pollComet, _this);
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
        enumerable: false,
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
        enumerable: false,
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
    return PlurkClient;
}(events_1.EventEmitter));
exports.PlurkClient = PlurkClient;
function transformWithTiming(body, response, resolveFullResponse) {
    if (!resolveFullResponse) {
        assignIfExists(body, response, 'elapsedTime');
        assignIfExists(body, response, 'responseStartTime');
        assignIfExists(body, response, 'timingStart');
        assignIfExists(body, response, 'timings');
        assignIfExists(body, response, 'timingPhases');
        return body;
    }
    return response;
}
function assignIfExists(a, b, key) {
    if ((key in b) && !(key in a))
        a[key] = b[key];
}
var PlurkClientUtils;
(function (PlurkClientUtils) {
    var plurkLimitToMatcher = /^(?:\|[0-9]+\|)*$/;
    function pollComet(client) {
        return client.pollComet();
    }
    PlurkClientUtils.pollComet = pollComet;
    function parseResponse(key, value) {
        switch (key) {
            case 'limited_to':
                if (typeof value === 'string' &&
                    plurkLimitToMatcher.test(value))
                    return limit_to_1.limitTo.parse(value);
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
    }
    PlurkClientUtils.parseResponse = parseResponse;
    function populateUsers(plurkData, users) {
        plurkData.owner = users[plurkData.owner_id];
        plurkData.user = users[plurkData.user_id];
        plurkData.replurker = users[plurkData.replurker_id];
        if (Array.isArray(plurkData.limit_to))
            plurkData.limit_to_data = plurkData.limit_to.map(populateUsersEntry, users);
        if (Array.isArray(plurkData.favorers))
            plurkData.favorers_data = plurkData.favorers.map(populateUsersEntry, users);
        if (Array.isArray(plurkData.replurkers))
            plurkData.replurkers_data = plurkData.replurkers.map(populateUsersEntry, users);
    }
    PlurkClientUtils.populateUsers = populateUsers;
    function populateUsersEntry(entry) {
        return this[entry];
    }
    PlurkClientUtils.populateUsersEntry = populateUsersEntry;
})(PlurkClientUtils || (PlurkClientUtils = {}));
__exportStar(require("./urlwatch"), exports);
__exportStar(require("./base36"), exports);
