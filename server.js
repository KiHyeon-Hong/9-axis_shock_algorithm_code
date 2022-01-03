const express = require('express');
const bodyParser = require('body-parser');
const MySql = require('sync-mysql');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

var connection = new MySql({
  host: 'localhost',
  user: 'root',
  password: 'gachon654321',
  database: '9axisdb',
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
