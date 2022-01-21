const express = require('express');
const bodyParser = require('body-parser');
const MySql = require('sync-mysql');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

let dbconfig = fs.readFileSync(__dirname + '/files/dbconfig.json', 'utf8');
dbconfig = JSON.parse(dbconfig);

var connection = new MySql({
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
});

app.get('/shockLevel', (req, res, next) => {
  const result = connection.query(`select * from ShockData`);
  connection.query(`insert into Log values(now(3), '/shockLevel')`);
  res.send(result);
});

app.get('/shockLevelDelete', (req, res, next) => {
  connection.query(`delete from ShockData`);
  connection.query(`insert into Log values(now(3), '/shockLevelDelete')`);
  res.send('Success');
});

app.get('/shockLog', (req, res, next) => {
  const result = connection.query(`select * from Log`);
  connection.query(`insert into Log values(now(3), '/shockLog')`);
  res.send(result);
});

app.get('/shockLogDelete', (req, res, next) => {
  connection.query(`delete from Log`);
  res.send('Success');
});

app.listen(65001, () => {
  console.log('server running...');
});
