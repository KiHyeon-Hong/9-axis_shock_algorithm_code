# 9-axis_shock_algorithm_code

- 9축센서(MPU9250) 기반의 시설물 충돌감지 알고리즘

## Algorithm overview

### 9축센서 기반의 시설물 충돌감지 알고리즘 분석 자료

- https://github.com/KiHyeon-Hong/9-axis_shock_algorithm_paper

## Environment

### 개발환경

- Raspberry 4 model B (RAM: 2GB)
- Linux raspberrypi 5.10.63-v7l+ #1459 SMP Wed Oct 6 16:41:57 BST 2021 armv7l GNU/Linux
- Node version: v8.11.4

## Installation 참고 자료

### Raspberry Pi 4 초기 설정

- https://kihyeon-hong.github.io/2021/11/15/Raspberry-Pi-4-%EC%B4%88%EA%B8%B0-%EC%84%B8%ED%8C%85%ED%95%98%EA%B8%B0/

### Raspberry Pi 4 gpio 설정

- https://kihyeon-hong.github.io/2021/11/15/Raspberry-Pi-4-gpio-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0/

### Raspberry Pi mysql 설정

- https://kihyeon-hong.github.io/2021/11/15/Raspberry-Pi-mysql-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0/

## Setting

### mysql Query

- 9축센서 기반의 시설물 충돌감지 알고리즘 충돌 정보 저장을 위한 mysql 쿼리문

```sql
create database 9axisdb;
use 9axisdb;

create table ShockData(time datetime(3), shocklevel int, shockdirection int, azimuthshockdirection int, shockvalue float, degree int, azimuth int, code int, message varchar(256));
create table Log(time datetime(3), log varchar(256));
```

### 9축센서 기반의 시설물 충돌감지 알고리즘 설정

- 9축센서 기반의 시설물 충돌감지 알고리즘 클론

```bash
git clone https://github.com/KiHyeon-Hong/9-axis_shock_algorithm_code.git Shock
cd Shock
npm install
```

#### files/config.json

- delay: 9축 데이터 측정 주기 (기본 값: 20ms)
- size: 9축 데이터 버퍼 크기 (기본 값: 50ms), delay 20ms에 size 50ms이면 충돌감지 알고리즘은 1,000ms(20ms \* 50ms)마다 호출된다.
- stop: 충돌이 발생하였다고 산출된 후, 일정 시간동안 발생하였다고 판단된 충돌은 충돌로 감지하지 않는다. (기본 값: 3회)
- direction: 9츅 센서 중에서 지면과 수직인 축("x", "y", "z")

```json
{ "delay": 20, "size": 50, "stop": 3, "direction": "y" }
```

#### files/dbconfig.json

- 해당 파일은 존재하지 않으므로, 만들어야 한다.
- 충돌감지 Database와 연동을 위해 작성하는 설정 파일
- host: 기본 값 "localhost"
- user: 기본 값 "root"
- password: mysql 초기 설정 시 선택한 비밀번호
- database: 9축센서 기반의 시설물 충돌감지 Database 명

```json
{ "host": "localhost", "user": "root", "password": "데이터베이스 비밀번호 입력", "database": "9axisdb" }
```

#### files/shockconfig.json

- weak: 약한 충돌 기준 임계치 (기본값: 11)
- strong: 강한 충돌 기준 임계치 (기본값 19)

```json
{ "weak": 11, "strong": 19 }
```

#### files/serverAddress.txt

- 전원 on 시 자신의 공용 IP와 사설 IP를 알리는 기능 동작 시, 해당 기능을 받을 서버 주소와 URI

```text
http://localhost:65001/notification
```

## Usage

- main.js: 9축센서 기반의 시설물 충돌감지 알고리즘 실행
- server.js: REST API 서버 실행

```bash
node main.js
node server.js
```

## REST API

- 192.168.0.37: 해당 9축센서 기반의 시설물 충돌감지 알고리즘이 동작중인 Raspberry Pi 4 IP 주소로 변경

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

```json
[
  {
    "time": "2022-01-21T02:04:23.834Z",
    "shocklevel": 1,
    "shockdirection": 132,
    "azimuthshockdirection": 255,
    "shockvalue": 15.5983,
    "degree": 0,
    "azimuth": 123,
    "code": 1,
    "message": "Success"
  },
  {
    "time": "2022-01-24T03:36:22.312Z",
    "shocklevel": 1,
    "shockdirection": 343,
    "azimuthshockdirection": 92,
    "shockvalue": 13.2752,
    "degree": 0,
    "azimuth": 109,
    "code": 1,
    "message": "Success"
  }
]
```

### DELETE http://192.168.0.37:65001/shockLevel

- 충격량 감지 기록 삭제 요청 API
- 충격량 데이터를 모두 삭제 요청한다.

```text
Success
```

### GET http://192.168.0.37:65001/shockLog

- 로그 요청 API
- 요청된 로그 정보를 시간과 함께 반환한다.

```json
[
  {
    "time": "2022-01-21T02:06:47.518Z",
    "log": "Collision detection algorithm start"
  },
  {
    "time": "2022-01-21T02:06:47.543Z",
    "log": "gpio pin setting..."
  },
  {
    "time": "2022-01-21T02:06:47.563Z",
    "log": "gpio pin setting success"
  },
  {
    "time": "2022-01-21T02:06:47.582Z",
    "log": "MPU9250 setting..."
  },
  {
    "time": "2022-01-21T02:06:48.108Z",
    "log": "MPU9250 setting success"
  },
  {
    "time": "2022-01-21T02:06:48.131Z",
    "log": "9axis data buffer setting success"
  },
  {
    "time": "2022-01-21T02:06:53.527Z",
    "log": "Shock detection!"
  }
]
```

### DELETE http://192.168.0.37:65001/shockLog

- 로그 삭제 요청 API
- 로그 기록을 모두 삭제 요청한다.

```text
Success
```

### PUT http://192.168.0.37:65001/shockLevel?weak=11&strong=19

- 약한 충돌, 강한 충돌 기준 설정 API
- 파라매터로 약한 충돌과 강한 충돌의 임계치를 설정한다.

```text
Success
```

### PUT http://192.168.1.103:65001/shockDirection?dir=y

- 9축 센서 방향 설정 API
- 파라매터로 아래를 바라보고 있는 축을 설정한다.
- "x", "y", "z"

```text
Success
```
