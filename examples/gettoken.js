'use strict';
const Readline = require('readline');
const util = require('util');
const yaml = require('node-yaml');
const { PlurkClient } = require('../lib/');

const client = new PlurkClient('Fr8niDHLBn66', 'spl0BbAZ0DnNaeb98wjOVn2woAdOgZ0m');

Promise.resolve(client)
.then(client => client.getRequestToken())
.then(({ authPage }) => {
  console.log('Go to this page to verify:', authPage);
  const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return Promise.all([
    rl, readlineQuestionPromise(rl, 'Enter or paste verifier here: ')
  ]);
})
.then(([rl, verifier]) => {
  rl.close();
  return client.getAccessToken(verifier);
})
.then(client => {
  console.log('Login success\ntoken:', client.token, '\nsecret:', client.tokenSecret);
  // Get current user's profile
  return client.request('Users/me');
})
.then(profile => {
  console.log('My profile:', yaml.dump(profile));
  // Get plurks just before 10 minutes from now
  return client.request('Polling/getPlurks', {
    offset: new Date(Date.now() - 10 * 60 * 1000)
  });
})
.then(info => {
  console.log('Read plurks before 10 minutes...\n', yaml.dump(info.plurks));
  // Listen to comet channel
  client.startComet();
  client.on('comet', () => console.log('New comet data arrived...'));
  client.on('new_plurk', response => console.log('[New Plurk]', yaml.dump(response)));
  client.on('new_response', response => console.log('[New Response]', yaml.dump(response)));
  client.on('error', err => console.error('[Error]', err.stack || util.inspect(err, { colors: true })));
})
.catch(err => console.error('Error:', err.stack || util.inspect(err, { colors: true })));

function readlineQuestionPromise(readline, question) {
  return new Promise(resolve => readline.question(question, resolve));
}