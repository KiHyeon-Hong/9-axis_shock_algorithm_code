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

### GET http://192.168.0.37:65001/shockLevel

- 충격량 감지 기록 요청 API
- 발생한 모든 충격량 데이터를 JSON 배열 형식으로 반환한다.

- time: 충격 발생 시각
- shocklevel: 0(충격 없음, DB에 기록되지 않음), 1(약한 충격), 2(강한 충격)
- shockdirection: 충격 발생 방향 (0 ~ 359)
- azimuthshockdirection: 방위각을 고려한 충격 발생 방향 (0 ~ 359)
- shockvalue: 충격량 (단위: m/s2)
- degree: 시설물 기울기 (0 ~ 90)
- azimute: 센서가 놓여진 방위각 (0 ~ 359)
- code: 상태 코드 (1: 정상, 0: 에러 발생)
- message: 상태 메시지


### DELETE http://192.168.0.37:65001/shockLevel

- 충격량 감지 기록 삭제 요청 API
- 충격량 데이터를 모두 삭제 요청한다.

### GET http://192.168.0.37:65001/shockLog

- 로그 요청 API
- 요청된 로그 정보를 시간과 함께 반환한다.

### DELETE http://192.168.0.37:65001/shockLog

- 로그 삭제 요청 API
- 로그 기록을 모두 삭제 요청한다.