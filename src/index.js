'use strict';
import { parse as parseUrl } from 'url';
import { parse as parseBody } from 'querystring';
import EventEmitter from 'events';
import request from 'request-promise';

const cometUrl = Symbol('cometUrl');
const pollCometRequest = Symbol('pollCometRequest');

const endPoint = 'https://www.plurk.com/';
const requestTokenUrl = `${endPoint}OAuth/request_token`;
const accessTokenUrl = `${endPoint}OAuth/access_token`;

const pathMatcher = /^\/?(?:APP\/)?(.+)$/;
const numberMatcher = /[0-9]+/g;
const plurkUrlMatcher = /plurk\.com\/(m\/)?p\/([0-9a-z]+)(\/#)?$/;
const plurkUserMatcher = /plurk\.com\/(m\/u\/)?([0-9a-zA-Z_]+)(\/#)?$/;
const plurkLimitToMatcher = /^(?:\|[0-9]+\|)*$/;

export class PlurkClient extends EventEmitter {
  constructor(consumerKey, consumerSecret, token, tokenSecret) {
    super();
    Object.assign(this, {
      consumerKey, consumerSecret,
      token, tokenSecret
    });
  }
  getRequestToken(callback = '') {
    return request({
      method: 'POST', url: requestTokenUrl,
      oauth: getOAuthParams(this, { callback })
    }).then(body => setOAuthParams(this, body));
  }
  getAccessToken(verifier) {
    return request({
      method: 'POST', url: accessTokenUrl,
      oauth: getOAuthParams(this, { verifier })
    }).then(body => setOAuthParams(this, body));
  }
  request(api, parameters) {
    const resolved = pathMatcher.exec(api);
    if(!resolved || resolved.length < 2)
      throw new Error(`Invalid api path '${api}'`);
    const form = {};
    let useFormData = false;
    if(parameters)
      for(let key in parameters) {
        const value = parameters[key];
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
    const options = {
      url: `${endPoint}APP/${resolved[1]}`,
      method: 'POST', json: true,
      jsonReviver: parseResponse,
      oauth: getOAuthParams(this)
    };
    options[useFormData ? 'formData' : 'form'] = form;
    return request(options).then(parseResponse);
  }
  startComet() {
    if(this.cometStarted) return;
    this.cometStarted = true;
    this.request('Realtime/getUserChannel').then(data => {
      if(!data.comet_server)
        throw new Error('Comet URL not found');
      this[cometUrl] = parseUrl(data.comet_server, true);
      if(this.cometStarted) pollComet(this);
    }).catch(err => {
      this.cometStarted = false;
      this.emit('error', err);
    });
  }
  stopComet() {
    if(!this.cometStarted) return;
    this.cometStarted = false;
    if(this[pollCometRequest]) {
      this[pollCometRequest].cancel();
      delete this[pollCometRequest];
    }
  }
  pollComet() {
    return pollComet(this);
  }
  get authPage() {
    return this.token ? `${endPoint}OAuth/authorize?oauth_token=${this.token}` : '';
  }
  get mobileAuthPage() {
    return this.token ? `${endPoint}m/authorize?oauth_token=${this.token}` : '';
  }
}

function pollComet(client) {
  if(client[pollCometRequest])
    client[pollCometRequest].cancel();
  if(!client.cometStarted) return;
  client[pollCometRequest] = request({
    url: client[cometUrl], timeout: 60000,
    agentOptions: { rejectUnauthorized: false }
  }).then(response => {
    response = JSON.parse(response.substring(
      response.indexOf('{'),
      response.lastIndexOf('}') + 1
    ), parseResponse);
    client.emit('comet', response);
    const { data, new_offset } = response;
    client[cometUrl].query.offset = new_offset;
    delete client[cometUrl].search;
    if(data && data.length)
      for(const entry of data)
        if(entry && entry.type) client.emit(entry.type, entry);
    process.nextTick(pollComet, client);
  }).catch(err => {
    if(client.stopCometOnError)
      client.cometStarted = false;
    else
      process.nextTick(pollComet, client);
    client.emit('error', err);
  }).finally(() => {
    delete client[pollCometRequest];
  });
}

function getOAuthParams(client, params = {}) {
  params.consumer_key = client.consumerKey;
  params.consumer_secret = client.consumerSecret;
  if(client.token)
    params.token = client.token;
  if(client.tokenSecret)
    params.token_secret = client.tokenSecret;
  return params;
}

function setOAuthParams(client, val) {
  val = parseBody(val);
  if(val.oauth_token)
    client.token = val.oauth_token;
  if(val.oauth_token_secret)
    client.tokenSecret = val.oauth_token_secret;
  return client;
}

const dateFields = ['date_of_birth', 'posted', 'now', 'issued'];

function parseResponse(key, value) {
  switch(typeof value) {
    case 'string':
      if(key === 'limited_to') {
        if(plurkLimitToMatcher.test(value))
          return limitTo.parse(value);
      } else if(dateFields.indexOf(key) >= 0)
        return new Date(value);
      break;
    case 'number':
      if(key === 'timestamp')
        return new Date(value * 1000);
  }
  return value;
}

export const limitTo = {
  parse(src) {
    if(Array.isArray(src)) return src;
    if(typeof src === 'string') {
      const matches = src.match(numberMatcher);
      if(matches) return matches.map(id => parseInt(id, 10));
    }
  },
  stringify(src) {
    return src.length ? `|${src.join('||')}|` : '';
  }
};

export const base36 = {
  decode(val) {
    return parseInt(val, 36);
  },
  encode(val) {
    switch(typeof val) {
      case 'string':
        return parseInt(val, 10);
      case 'number':
        if(!isNaN(val))
          return val.toString(36);
    }
  }
};

export const urlmatch = {
  plurk(url, decode) {
    const result = plurkUrlMatcher.exec(url);
    if(result) {
      const id = result[2];
      if(id) return decode ? base36.decode(id) : id;
    }
  },
  user(url, decode) {
    const result = plurkUserMatcher.exec(url);
    if(result) {
      const id = result[2];
      if(id) return decode ? base36.decode(id) : id;
    }
  }
};
