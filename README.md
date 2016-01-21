mandrill-webhook-authenticator
=========
A small express middleware to authenticate Mandrill inbound webhooks

## Installation

```bash
  $ npm install mandrill-webhook-authenticator --save
```

## Usage

```javascript
var authenticator = require('mandrill-webhook-authenticator');

app.use(authenticator(options));
```

  # options

```javascript
var config = {
  webhookAuthKey: 'webhooks_auth_key',
  domain: 'http://www.example.com'
};
```

  * **webhookAuthKey:** mandrill webhook auth key, used for validating the Mandrill Signature
  * **domain:** domain of the webhook you set up on Mandrill, used for validating the Mandrill Signature

## Tests

  npm test

## Links

  [api documentation](./docs/api.md)
  [jscs Report](./docs/jscs.md)
  [jshint Report](./docs/jshint.md)
  [Test Results])(./docs/test.md)

## Contributing

  Use [Airbnb jscs style guide](https://github.com/airbnb/javascript).

  Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

  Not yet released.
