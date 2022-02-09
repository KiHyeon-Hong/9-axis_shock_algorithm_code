const gpio = require('node-wiring-pi');
const express = require('express');
const bodyParser = require('body-parser');
const MySql = require('sync-mysql');
const fs = require('fs');

const LED = 26;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

let shockconfig = fs.readFileSync(__dirname + '/files/shockconfig.json', 'utf8');
shockconfig = JSON.parse(shockconfig);

let dbconfig = fs.readFileSync(__dirname + '/files/dbconfig.json', 'utf8');
dbconfig = JSON.parse(dbconfig);

var connection = new MySql({
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
});

gpio.setup('wpi');
gpio.pinMode(LED, gpio.OUTPUT);

const ledOn = () => {
  gpio.digitalWrite(LED, 1);
  setTimeout(ledOff, 3000);
};

const ledOff = () => {
  gpio.digitalWrite(LED, 0);
};

app.get('/shockLevel', (req, res, next) => {
  const result = connection.query(`select * from ShockData`);

  ledOn();
  res.send(result);
});

app.delete('/shockLevel', (req, res, next) => {
  connection.query(`delete from ShockData`);

  ledOn();
  res.send('Success');
});

app.get('/shockLog', (req, res, next) => {
  const result = connection.query(`select * from Log`);

  ledOn();
  res.send(result);
});

app.delete('/shockLog', (req, res, next) => {
  connection.query(`delete from Log`);

  ledOn();
  res.send('Success');
});

app.put('/shockLevel', (req, res, next) => {
  shockconfig = { weak: parseInt(req.query.weak), strong: parseInt(req.query.strong) };
  shockconfig = JSON.stringify(shockconfig);
  fs.writeFileSync(__dirname + '/files/shockconfig.json', shockconfig, 'utf8');

  ledOn();
  res.send('Success');
});

process.on('SIGINT', function () {
  console.log('Exit...');

  gpio.digitalWrite(LED, 0);

  process.exit();
});

app.listen(65001, () => {
  console.log('Server running at 65001');
});
