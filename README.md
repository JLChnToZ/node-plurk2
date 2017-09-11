Node-Plurk2
===========
Plurk2 is a full featured Plurk API 2.0 interface for Node.js. It wraps all requests with OAuth 1.0 headers which has been documented. Also it handles events from comet channel.

Installation
----------
```sh
$ npm i --save plurk2
```

Usage
-----
Besides the main `PlurkClient` class, it also bundles other utilities for using the API. Also all async calls are wrapped with [new promise interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and callback function pattern is not provided.

### PlurkClient
`PlurkClient` is a class that wraps all plurk API call and handles comet channel when enabled. It inherits from Node.js's [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) class.

- `new PlurkClient(consumerToken, consumerTokenSecret, [accessToken], [accessTokenSecret])` - Constructor.
	- `consumerToken` - Consumer token, can be obtain one from Plurk App console.
	- `consumerTokenSecret` - Consumer token secret, should be together with consumer token.
	- `accessToken` - Oauth access token, optional. You may assign it here or use `getRequestToken()` and then `getAccessToken()` to obtain one from user with oauth authentication flow.
	- `accessTokenSecret` - Oauth access token secret, optional. Also this should be come with access token.
- `plurkClient.getRequestToken([callback])` >> `Promise` (`plurkClient`) - Get oauth request token (temporary) for user to authenticate. It will assigns `token` and `tokenSecret` of current instance for further process.
	- `callback`: Redirect URL after authenticate success, can be omitted if this is not a web app.
	- returns `plurkClient` once promise resolved: Current plurk client instance.
- `plurkClient.getAccessToken(verifier)` >> `Promise` (`plurkClient`) - Get oauth access token (permanent) for requesting other API. It will assigns `token` and `tokenSecret` of current instance. Should be called once users' verifier has been received.
	- `verifier`: The oauth verifier received from the user.
	- returns `plurkClient` once promise resolved: Current plurk client instance.
- `plurkClient.request(api, [parameters])` >> `Promise` (`jsonData`) - Make a post request API call to Plurk (as recommended in the documentation), it will uses the oauth token provided in the client instance if available.
	- `api`: API path as written in the documentation. `APP/` prefix can be omitted.
	- `parameters`: Object hash of the parameters, can be omitted if no parameters. Also it will automatically converts `Date` object entries to [ISO8601 string](https://en.wikipedia.org/wiki/ISO_8601) and `Array` object entries to JSON string before request. You may also pass Node.js native `Buffer` or `Stream` values for image uploading APIs such as [`/APP/Timeline/uploadPicture`](https://www.plurk.com/API#/APP/Timeline/uploadPicture).
	- returns `jsonData` once promise resolved: The parsed JSON data respond from Plurk. It will auto converts all known date/time fields to `Date` objects and `limited_to` field to array of numbers.
- `plurkClient.startComet()` - Start long poll from comet channel, it auto handles request for comet server URL and it will auto keep polling until you stops it.
- `plurkClient.stopComet()` - Stops long poll from comet channel.
- `plurkClient.authPage` - User authentication URL. Should be inform user to navigate to this URL once the promise of `getRequestToken(...)` has been resolved.
- `plurkClient.mobileAuthPage` - Mobile version of user authentication URL. Users may navigate to this URL instead of `authPage` if they are using smartphones.
- `plurkClient.on(eventName, function(data) {...})` - Event callback on comet channel receives each data push.
	- `eventName`: Can be `new_plurk`, `new_response` or any others.
	- `data`: Parsed JSON push data entry. All fields will be converted to JavaScript types as same as the response by calling `request()`.
- `plurkClient.on('comet', function(comet) {...})` - Event callback on comet channel responses. This will be called even on comet channel does not returns any new push. This event fires before any other comet channel events.
	- `comet`: Raw comet channel callback. All fields will be converted to JavaScript types as same as the response by calling `request()`.
- `plurkClient.on('error', function(err) {...})` - General error callback from comet channel.
	- `err`: Error thrown when parsing comet channel, or when making a request on comet.
- `plurkClient.stopCometOnError` - Boolean field, set to `true` to automatic stops the comet channel when any error has been thrown, or else it will keep reconnect even have errors.

### limitTo
`limitTo` is an utility namespace that encodes and decodes Plurk limitTo field format to and from array which looks like this: `|1||2|`.

- `limitTo.parse(src)` >> `Array` - Parses the limitTo format to array
	- `src`: Source string.
- `limitTo.stringify(src)` >> `string` - Converts array of Plurk IDs to limitTo format.
	- `src`: Source array of Plurk IDs.

### base36
`base36` is an utility that converts base36 string to or from number.

- `base36.decode(val)` >> `Number` - Base36 string to number.
	- `val`: Base36 string.
- `base36.encode(val)` >> `String` - Number to base36 string.
	- `val`: Number.

### urlmatch
`urlmatch` is an utility that extracts an user or a plurk's id from URL.

- `urlmatch.plurk(url, decode)` >> `Number`/`String` - Extracts plurk id from URL provided.
	- `url`: Url to parse.
	- `decode`: Should automatic converts base36 id to number?
- `urlmatch.user(url, decode)` >> `Number`/`String` - Extracts user id from URL provided.
	- `url`: Url to parse.
	- `decode`: Should automatic converts base36 id to number?

### Example Usage
```javascript
const { PlurkClient } = require('plurk2');

const client = new PlurkClient('CONSUMER_TOKEN', 'CONSUMER_TOKEN_SECRET', 'ACCESS_TOKEN', 'ACCESS_TOKEN_SECRET');

client.request('Users/me')
.then(profile => console.log(profile))
.catch(err => console.error(err));
```

For more examples can have a look in `examples/get-token.js`.

Reference: [Plurk API 2.0](https://www.plurk.com/API)

License
-------
[MIT](LICENSE)