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
Documentation will be available [here](https://code.moka-rin.moe/node-plurk2).

### Example Usage
```javascript
const { PlurkClient } = require('plurk2');

const client = new PlurkClient('CONSUMER_TOKEN', 'CONSUMER_TOKEN_SECRET', 'ACCESS_TOKEN', 'ACCESS_TOKEN_SECRET');

client.request('Users/me')
.then(profile => console.log(profile))
.catch(err => console.error(err));
```

For more examples can have a look in [`examples/get-token.js`](examples/get-token.js).

Reference: [Plurk API 2.0](https://www.plurk.com/API)

License
-------
[MIT](LICENSE)