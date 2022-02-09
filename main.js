const gpio = require('node-wiring-pi');
const fs = require('fs');
const MySql = require('sync-mysql');
var mpu9250 = require('mpu9250');
const Shock_level = require(__dirname + '/Shock_level.js');

let config = fs.readFileSync(__dirname + '/files/config.json', 'utf8');
config = JSON.parse(config);

let dbconfig = fs.readFileSync(__dirname + '/files/dbconfig.json', 'utf8');
dbconfig = JSON.parse(dbconfig);

var connection = new MySql({
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
});

const Blue = 29;
const Red = 28;
const Green = 27;
const LED = 26;

connection.query(`insert into Log values(now(3), 'Collision detection algorithm start')`);
connection.query(`insert into Log values(now(3), 'gpio pin setting...')`);

gpio.setup('wpi');
gpio.pinMode(Blue, gpio.OUTPUT);
gpio.pinMode(Red, gpio.OUTPUT);
gpio.pinMode(Green, gpio.OUTPUT);
gpio.pinMode(LED, gpio.OUTPUT);

connection.query(`insert into Log values(now(3), 'gpio pin setting success')`);
connection.query(`insert into Log values(now(3), 'MPU9250 setting...')`);

var mpu = new mpu9250({
  device: '/dev/i2c-1',
  address: 0x68,
  UpMagneto: true,
  scaleValues: true,
  DEBUG: false,
  ak_address: 0x0c,
  GYRO_FS: 0,
  ACCEL_FS: 2,
  DLPF_CFG: mpu9250.MPU9250.DLPF_CFG_3600HZ,
  A_DLPF_CFG: mpu9250.MPU9250.A_DLPF_CFG_460HZ,
  SAMPLE_RATE: 8000,
});
mpu.initialize();

connection.query(`insert into Log values(now(3), 'MPU9250 setting success')`);
connection.query(`insert into Log values(now(3), '9axis data buffer setting...')`);

let flag = 0;
var inputBuffer = new Array();

connection.query(`insert into Log values(now(3), '9axis data buffer setting success')`);

const ShockLevel = () => {
  let returnLevel = Shock_level.getShockLevel(0, inputBuffer);

  if (returnLevel.shocklevel == 2) {
    gpio.digitalWrite(Blue, 0);
    gpio.digitalWrite(Green, 0);
    gpio.digitalWrite(Red, 1);
  } else if (returnLevel.shocklevel == 1) {
    gpio.digitalWrite(Blue, 0);
    gpio.digitalWrite(Green, 1);
    gpio.digitalWrite(Red, 0);
  } else {
    gpio.digitalWrite(Blue, 1);
    gpio.digitalWrite(Green, 0);
    gpio.digitalWrite(Red, 0);
  }

  if (returnLevel.shocklevel != 0) {
    connection.query(
      `insert into ShockData values(now(3), ${returnLevel.shocklevel}, ${returnLevel.shockDirection}, ${returnLevel.azimuthShockDirection}, ${returnLevel.shockValue}, ${returnLevel.degree}, ${
        returnLevel.azimuth
      }, ${returnLevel.code}, '${returnLevel.message.length === 0 ? 'Success' : 'Fail'}')`
    );
    connection.query(`insert into Log values(now(3), 'Shock detection')`);
    flag = config.stop;
  }

  // console.log(returnLevel);
};

const main = () => {
  let tempArr = new Object();
  let temp = mpu.getMotion9();

  /*
   * z축이 아래일 때, z = 9, x = 0, y = 0, 아래 충격 y + 오른쪽 충격 x +
   * y축이 아래일 때 y = 9, x = 0, z = 0, 아래 충격 z - 오른쪽 충격 x +
   * x축이 아래일 때, x = 9, y = 0, z = 0, 아래 충격 z - 오른쪽 충격 y -
   */
  if (config.direction === 'x') {
    tempArr.acc_x = -temp[1] * 10;
    tempArr.acc_y = -temp[2] * 10;
    tempArr.acc_z = temp[0] * 10;
    tempArr.vel_x = -temp[4];
    tempArr.vel_y = -temp[5];
    tempArr.vel_z = temp[3];
    tempArr.mag_x = -temp[7];
    tempArr.mag_y = -temp[8];
    tempArr.mag_z = temp[6];
  } else if (config.direction === 'y') {
    tempArr.acc_x = temp[0] * 10;
    tempArr.acc_y = -temp[2] * 10;
    tempArr.acc_z = temp[1] * 10;
    tempArr.vel_x = temp[3];
    tempArr.vel_y = -temp[5];
    tempArr.vel_z = temp[4];
    tempArr.mag_x = temp[6];
    tempArr.mag_y = -temp[8];
    tempArr.mag_z = temp[7];
  } else if (config.direction === 'z') {
    tempArr.acc_x = temp[0] * 10;
    tempArr.acc_y = temp[1] * 10;
    tempArr.acc_z = temp[2] * 10;
    tempArr.vel_x = temp[3];
    tempArr.vel_y = temp[4];
    tempArr.vel_z = temp[5];
    tempArr.mag_x = temp[6];
    tempArr.mag_y = temp[7];
    tempArr.mag_z = temp[8];
  }

  inputBuffer.push(tempArr);
  console.log(tempArr);

  if (inputBuffer.length >= config.size * 2) {
    if (flag == 0) {
      ShockLevel();
    }

    let temp = inputBuffer;
    inputBuffer = new Array();

    for (let i = 0; i < config.size; i++) {
      inputBuffer.push(temp[config.size + i]);
    }

    flag = flag > 0 ? flag - 1 : 0;
  }

  setTimeout(main, config.delay);
};

process.on('SIGINT', function () {
  console.log('Exit...');

  gpio.digitalWrite(Blue, 0);
  gpio.digitalWrite(Red, 0);
  gpio.digitalWrite(Green, 0);
  gpio.digitalWrite(LED, 0);

  process.exit();
});

main();
