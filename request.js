const request = require('request');
const ip = require('ip');
const fs = require('fs');

const addr = fs.readFileSync(__dirname + '/files/serverAddress.txt', 'utf8');

request.get({ url: 'https://api.ipify.org' }, function (_1, _2, body) {
  console.log('Public IP address > ' + body);
  console.log('Virtual IP address > ' + ip.address());

  request.get({ url: `${addr}?pri=${ip.address()}&pub=${body}` }, function (_1, _2, body) {});
});
