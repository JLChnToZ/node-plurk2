'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.urlmatch = exports.base36 = exports.limitTo = exports.PlurkClient = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _querystring = require('querystring');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cometUrl = Symbol('cometUrl');
var pollCometRequest = Symbol('pollCometRequest');

var endPoint = 'https://www.plurk.com/';
var requestTokenUrl = endPoint + 'OAuth/request_token';
var accessTokenUrl = endPoint + 'OAuth/access_token';

var pathMatcher = /^\/?(?:APP\/)?(.+)$/;
var numberMatcher = /[0-9]+/g;
var plurkUrlMatcher = /plurk\.com\/(m\/)?p\/([0-9a-z]+)(\/#)?$/;
var plurkUserMatcher = /plurk\.com\/(m\/u\/)?([0-9a-zA-Z_]+)(\/#)?$/;
var plurkLimitToMatcher = /^(?:\|[0-9]+\|)*$/;

var PlurkClient = exports.PlurkClient = function (_EventEmitter) {
  _inherits(PlurkClient, _EventEmitter);

  function PlurkClient(consumerKey, consumerSecret, token, tokenSecret) {
    _classCallCheck(this, PlurkClient);

    var _this = _possibleConstructorReturn(this, (PlurkClient.__proto__ || Object.getPrototypeOf(PlurkClient)).call(this));

    Object.assign(_this, {
      consumerKey: consumerKey, consumerSecret: consumerSecret,
      token: token, tokenSecret: tokenSecret
    });
    return _this;
  }

  _createClass(PlurkClient, [{
    key: 'getRequestToken',
    value: function getRequestToken() {
      var _this2 = this;

      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return (0, _requestPromise2.default)({
        method: 'POST', url: requestTokenUrl,
        oauth: getOAuthParams(this, { callback: callback })
      }).then(function (body) {
        return setOAuthParams(_this2, body);
      });
    }
  }, {
    key: 'getAccessToken',
    value: function getAccessToken(verifier) {
      var _this3 = this;

      return (0, _requestPromise2.default)({
        method: 'POST', url: accessTokenUrl,
        oauth: getOAuthParams(this, { verifier: verifier })
      }).then(function (body) {
        return setOAuthParams(_this3, body);
      });
    }
  }, {
    key: 'request',
    value: function request(api, parameters) {
      var resolved = pathMatcher.exec(api);
      if (!resolved || resolved.length < 2) throw new Error('Invalid api path \'' + api + '\'');
      var form = {};
      var useFormData = false;
      if (parameters) for (var key in parameters) {
        var value = parameters[key];
        switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
          case 'undefined':case 'function':case 'symbol':
            break;
          case 'object':
            if (value instanceof Date) form[key] = value.toISOString();else if (value && (value instanceof Buffer || typeof value.pipe === 'function')) {
              form[key] = value;
              useFormData = true;
            } else form[key] = JSON.stringify(value);
            break;
          default:
            form[key] = value;
            break;
        }
      }
      var options = {
        url: endPoint + 'APP/' + resolved[1],
        method: 'POST', json: true,
        jsonReviver: parseResponse,
        oauth: getOAuthParams(this)
      };
      options[useFormData ? 'formData' : 'form'] = form;
      return (0, _requestPromise2.default)(options).then(parseResponse);
    }
  }, {
    key: 'startComet',
    value: function startComet() {
      var _this4 = this;

      if (this.cometStarted) return;
      this.cometStarted = true;
      this.request('Realtime/getUserChannel').then(function (data) {
        if (!data.comet_server) throw new Error('Comet URL not found');
        _this4[cometUrl] = (0, _url.parse)(data.comet_server, true);
        if (_this4.cometStarted) _pollComet(_this4);
      }).catch(function (err) {
        _this4.cometStarted = false;
        _this4.emit('error', err);
      });
    }
  }, {
    key: 'stopComet',
    value: function stopComet() {
      if (!this.cometStarted) return;
      this.cometStarted = false;
      if (this[pollCometRequest]) {
        this[pollCometRequest].cancel();
        delete this[pollCometRequest];
      }
    }
  }, {
    key: 'pollComet',
    value: function pollComet() {
      return _pollComet(this);
    }
  }, {
    key: 'authPage',
    get: function get() {
      return this.token ? endPoint + 'OAuth/authorize?oauth_token=' + this.token : '';
    }
  }, {
    key: 'mobileAuthPage',
    get: function get() {
      return this.token ? endPoint + 'm/authorize?oauth_token=' + this.token : '';
    }
  }]);

  return PlurkClient;
}(_events2.default);

function _pollComet(client) {
  if (client[pollCometRequest]) client[pollCometRequest].cancel();
  if (!client.cometStarted) return;
  client[pollCometRequest] = (0, _requestPromise2.default)({
    url: client[cometUrl], timeout: 60000,
    agentOptions: { rejectUnauthorized: false }
  }).then(function (response) {
    response = JSON.parse(response.substring(response.indexOf('{'), response.lastIndexOf('}') + 1), parseResponse);
    client.emit('comet', response);
    var _response = response,
        data = _response.data,
        new_offset = _response.new_offset;

    client[cometUrl].query.offset = new_offset;
    delete client[cometUrl].search;
    if (data && data.length) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entry = _step.value;

          if (entry && entry.type) client.emit(entry.type, entry);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }process.nextTick(_pollComet, client);
  }).catch(function (err) {
    if (client.stopCometOnError) client.cometStarted = false;else process.nextTick(_pollComet, client);
    client.emit('error', err);
  }).finally(function () {
    delete client[pollCometRequest];
  });
}

function getOAuthParams(client) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  params.consumer_key = client.consumerKey;
  params.consumer_secret = client.consumerSecret;
  if (client.token) params.token = client.token;
  if (client.tokenSecret) params.token_secret = client.tokenSecret;
  return params;
}

function setOAuthParams(client, val) {
  val = (0, _querystring.parse)(val);
  if (val.oauth_token) client.token = val.oauth_token;
  if (val.oauth_token_secret) client.tokenSecret = val.oauth_token_secret;
  return client;
}

var dateFields = ['date_of_birth', 'posted', 'now', 'issued'];

function parseResponse(key, value) {
  switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
    case 'string':
      if (key === 'limited_to') {
        if (plurkLimitToMatcher.test(value)) return limitTo.parse(value);
      } else if (dateFields.indexOf(key) >= 0) return new Date(value);
      break;
    case 'number':
      if (key === 'timestamp') return new Date(value * 1000);
  }
  return value;
}

var limitTo = exports.limitTo = {
  parse: function parse(src) {
    if (Array.isArray(src)) return src;
    if (typeof src === 'string') {
      var matches = src.match(numberMatcher);
      if (matches) return matches.map(function (id) {
        return parseInt(id, 10);
      });
    }
  },
  stringify: function stringify(src) {
    return src.length ? '|' + src.join('||') + '|' : '';
  }
};

var base36 = exports.base36 = {
  decode: function decode(val) {
    return parseInt(val, 36);
  },
  encode: function encode(val) {
    switch (typeof val === 'undefined' ? 'undefined' : _typeof(val)) {
      case 'string':
        return parseInt(val, 10);
      case 'number':
        if (!isNaN(val)) return val.toString(36);
    }
  }
};

var urlmatch = exports.urlmatch = {
  plurk: function plurk(url, decode) {
    var result = plurkUrlMatcher.exec(url);
    if (result) {
      var id = result[2];
      if (id) return decode ? base36.decode(id) : id;
    }
  },
  user: function user(url, decode) {
    var result = plurkUserMatcher.exec(url);
    if (result) {
      var id = result[2];
      if (id) return decode ? base36.decode(id) : id;
    }
  }
};