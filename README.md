# 9-axis_shock_algorithm_code

- 9축센서(MPU9250) 기반의 시설물 충돌감지 알고리즘
- https://github.com/KiHyeon-Hong/9-axis_shock_algorithm_paper

## Environment

- Raspberry 4 model B(2GB)
- Linux raspberrypi 5.10.63-v7l+ #1459 SMP Wed Oct 6 16:41:57 BST 2021 armv7l GNU/Linux
- Node version: v8.11.4

## Installation

- https://kihyeon-hong.github.io/2021/11/15/Raspberry-Pi-4-%EC%B4%88%EA%B8%B0-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0/
- https://kihyeon-hong.github.io/2021/11/15/Raspberry-Pi-4-gpio-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0/
- https://kihyeon-hong.github.io/2021/11/15/Raspberry-Pi-mysql-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0/

## Setting

## files/config.json

```json
{ "delay": 20, "size": 50, "stop": 3 }
```

### files.dbconfig.json

```json
{ "host": "localhost", "user": "root", "password": "gachon654321", "database": "9axisdb" }
```

### mysql Query

```sql
create table ShockData(time datetime(3), shocklevel int, shockdirection int, azimuthshockdirection int, shockvalue float, degree int, azimuth int, code int, message varchar(256));
create table Log(time datetime(3), log varchar(256));
```

## Usage

- 

```bash
git clone https://github.com/KiHyeon-Hong/9-axis_shock_algorithm_code.git Shock
cd Shock
npm install
```

```bash
node main.js
node server.js
```

## API

- 