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

let config = fs.readFileSync(__dirname + '/files/config.json', 'utf8');
config = JSON.parse(config);

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
  if (
    !isNaN(req.query.weak) &&
    !isNaN(req.query.strong) &&
    parseInt(req.query.weak) > 10 &&
    parseInt(req.query.weak) < 999 &&
    parseInt(req.query.strong) > parseInt(req.query.weak) &&
    parseInt(req.query.strong) < 999
  ) {
    shockconfig = { weak: parseInt(req.query.weak), strong: parseInt(req.query.strong) };
    shockconfig = JSON.stringify(shockconfig);
    fs.writeFileSync(__dirname + '/files/shockconfig.json', shockconfig, 'utf8');

    ledOn();
    res.send('Success');
  } else {
    res.send('fail');
  }
});

app.put('/shockDirection', (req, res, next) => {
  if (req.query.dir === 'x' || req.query.dir === 'y' || req.query.dir === 'z') {
    config = { delay: 20, size: 50, stop: 3, direction: req.query.dir };
    config = JSON.stringify(config);
    fs.writeFileSync(__dirname + '/files/config.json', config, 'utf8');

    ledOn();
    res.send('Success');
  } else {
    res.send('fail');
  }
});

process.on('SIGINT', function () {
  console.log('Exit...');

  gpio.digitalWrite(LED, 0);

  process.exit();
});

app.listen(65001, () => {
  console.log('Server running at 65001');
});
