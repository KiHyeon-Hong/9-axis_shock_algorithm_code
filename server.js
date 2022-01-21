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
  res.send(result);
});

app.delete('/shockLevel', (req, res, next) => {
  connection.query(`delete from ShockData`);
  res.send('Success');
});

app.get('/shockLog', (req, res, next) => {
  const result = connection.query(`select * from Log`);
  res.send(result);
});

app.delete('/shockLog', (req, res, next) => {
  connection.query(`delete from Log`);
  res.send('Success');
});

app.listen(65001, () => {
  console.log('server running...');
});
