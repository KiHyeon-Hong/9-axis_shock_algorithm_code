const STRONG = 19;  // 강한 충격 임계값
const WEAK = 11;    // 약한 충격 임계값
const PI = 3.14159; // PI값 정의
const STOP = 10.0;  // 센서가 정지해 있다고 판단하는 자이로 데이터 임계값
const PERPENDICULAR = 10.0; // 지면과 수직이라고 가정하는 센서 기울기 임계값

/*
 * 가속도 센서를 이용한 충격량 측정 메소드
 * 입력된 9축 센서 데이터 중 가장 강한 충격량 반환
 */
function getShock(inputData) {
  let maxShock = 0;

  for (let i = 0; i < inputData.length; i++) {
    let temp = Math.sqrt(Math.pow(inputData[i].acc_x, 2) + Math.pow(inputData[i].acc_y, 2) + Math.pow(inputData[i].acc_z, 2));
    if (temp > maxShock) {
      maxShock = temp;
    }
  }
  return maxShock;
}

function getLastShock(inputData) {
  return Math.sqrt(Math.pow(inputData[inputData.length - 1].acc_x, 2) + Math.pow(inputData[inputData.length - 1].acc_y, 2) + Math.pow(inputData[inputData.length - 1].acc_z, 2));
}

/*
 * 자이로 센서를 이용한 움직임 측정 메소드
 * 입력된 9축 센서 데이터 중 가장 강한 움직임 반환
 */
function getGyro(inputData) {
  let maxGyro = 0;

  for (let i = 0; i < inputData.length; i++) {
    let temp = Math.sqrt(Math.pow(inputData[i].vel_x, 2) + Math.pow(inputData[i].vel_y, 2) + Math.pow(inputData[i].vel_z, 2));
    if (temp > maxGyro) {
      maxGyro = temp;
    }
  }
  return maxGyro;
}

/*
 * 가속도 센서를 이용한 충격 방향 감지 메소드
 * 입력된 x축 가속도 센서 데이터를 기반으로 충격 방향 감지
 */
function getXDirection(inputData) {
  let min = inputData[0].acc_x;
  let max = inputData[0].acc_x;
  let minPoint = 0;
  let maxPoint = 0;

  for (let i = 1; i < inputData.length; i++) {
    if (min > inputData[i].acc_x) {
      minPoint = i;
      min = inputData[i].acc_x;
    }

    if (max < inputData[i].acc_x) {
      maxPoint = i;
      max = inputData[i].acc_x;
    }
  }

  if (maxPoint > minPoint) {
    // 왼쪽으로 이동
    return -1;
  } else {
    // 오른쪽으로 이동
    return 1;
  }
}

/*
 * 가속도 센서를 이용한 충격 방향 감지 메소드
 * 입력된 y축 가속도 센서 데이터를 기반으로 충격 방향 감지
 */
function getYDirection(inputData) {
  let min = inputData[0].acc_y;
  let max = inputData[0].acc_y;
  let minPoint = 0;
  let maxPoint = 0;

  for (let i = 1; i < inputData.length; i++) {
    if (min > inputData[i].acc_y) {
      minPoint = i;
      min = inputData[i].acc_y;
    }

    if (max < inputData[i].acc_y) {
      maxPoint = i;
      max = inputData[i].acc_y;
    }
  }

  if (maxPoint > minPoint) {
    // 아래로 이동
    return -1;
  } else {
    // 위로 이동
    return 1;
  }
}

/*
 * 가속도 센서를 이용한 충격 방향 감지 메소드
 * 입력된 가속도 센서 데이터를 기반으로 충격 방향 감지
 */
function getDirection(inputData) {
  let xMax = 0.0;
  let yMax = 0.0;
  let xTemp = 0.0;
  let yTemp = 0.0;

  for (let i = 0; i < inputData.length; i++) {
    xTemp = Math.abs(inputData[i].acc_x);
    yTemp = Math.abs(inputData[i].acc_y);

    if (xTemp > xMax) {
      xMax = xTemp;
    }

    if (yTemp > yMax) {
      yMax = yTemp;
    }
  }

  let x = getXDirection(inputData);
  let y = getYDirection(inputData);

  if (x == -1) {
    if (y == -1) {
      // 왼쪽 아래쪽 이동
      return 270 - (Math.atan(yMax / xMax) * 180) / PI;
    } else {
      // 왼쪽 위쪽 이동
      return 270 + (Math.atan(yMax / xMax) * 180) / PI;
    }
  } else {
    if (y == -1) {
      // 오른쪽 아래 이동
      return 90 + (Math.atan(yMax / xMax) * 180) / PI;
    } else {
      // 오른쪽 위 이동
      return 90 - (Math.atan(yMax / xMax) * 180) / PI;
    }
  }
}

/*
 * 가속도 센서를 이용한 기울기 측정 메소드
 * 가속도 센서 데이터를 기반으로 기울기 측정
 */
function getDegree(inputData) {
  let x_degree = Math.abs((Math.atan(-inputData[0].acc_x / Math.sqrt(Math.pow(inputData[0].acc_y, 2) + Math.pow(inputData[0].acc_z, 2))) * 180) / PI);
  let y_degree = Math.abs((Math.atan(-inputData[0].acc_y / Math.sqrt(Math.pow(inputData[0].acc_x, 2) + Math.pow(inputData[0].acc_z, 2))) * 180) / PI);

  return x_degree > y_degree ? x_degree : y_degree;
}

function getDegree_temp(inputData) {
  let x_degree = Math.abs((Math.atan(inputData[0].acc_x / inputData[0].acc_z) * 180) / PI);
  let y_degree = Math.abs((Math.atan(inputData[0].acc_y / inputData[0].acc_z) * 180) / PI);

  return x_degree > y_degree ? x_degree : y_degree;
}

/*
 * 지자기 센서를 이용한 센서 방향 측정 메소드
 * 지자기 센서 데이터를 기반으로 센서가 설치된 방위각을 측정
 */
function getMag(inputData) {
  if (inputData[0].mag_y == 0) {
    if (inputData[0].mag_x > 0) {
      return 0;
    } else {
      return 180;
    }
  } else if (inputData[0].mag_y < 0) {
    return (Math.atan(inputData[0].mag_x / inputData[0].mag_y) * 180) / PI + 90;
  } else {
    return (Math.atan(inputData[0].mag_x / inputData[0].mag_y) * 180) / PI + 270;
  }
}

/*
 * 9축 센서 데이터를 이용한 지능형 충격감지 알고리즘 메소드
 */
exports.getShockLevel = function (reqID, inputData) {
  // 반환 데이터의 기본 값
  let returnLevel = {
    reqID: reqID,
    shocklevel: 0,
    shockDirection: 0,
    azimuthShockDirection: 0,
    shockValue: 0.0,
    degree: 0.0,
    azimuth: 0,
    code: 1,
    message: [],
  };

  // 입력 데이터에서 최대 충격량 측정
  returnLevel.shockValue = getShock(inputData);

  if (returnLevel.shockValue > STRONG) {
    // 강한 충격 발생
    returnLevel.shocklevel = 2;
  } else if (returnLevel.shockValue > WEAK) {
    // 약한 충격 발생
    returnLevel.shocklevel = 1;
  }

  if (getLastShock(inputData) > WEAK) {
    returnLevel.shocklevel = 0;
  }

  // 충격량 측정 에러 처리
  if (returnLevel.shocklevel != 0 && returnLevel.shocklevel != 1 && returnLevel.shocklevel != 2) {
    returnLevel.code = -1;
    returnLevel.message.push('ShockLevel Error');
  }

  // 입력 데이터 움직임 측정
  let gyro = getGyro(inputData);

  // 움직임 측정 에러 처리
  if (gyro < 0) {
    returnLevel.code = -1;
    returnLevel.message.push('Gyro Error');
  }

  // 입력 데이터의 기울기 측정
  // 센서가 움직이고 있지 않을 경우에만 기울기를 측정
  let degree = getDegree(inputData);
  if (degree > PERPENDICULAR && gyro < STOP) {
    returnLevel.degree = degree;
  }

  // 입력 데이터의 충격 방향 측정
  if (returnLevel.shocklevel != 0) {
    returnLevel.shockDirection = getDirection(inputData);
  }

  // 충격 방향 에러 처리
  if (returnLevel.shockDirection < 0 || returnLevel.shockDirection > 360) {
    returnLevel.code = -1;
    returnLevel.message.push('ShockDirection Error');
  }

  // 센서의 방위각 측정
  returnLevel.azimuth = getMag(inputData);

  // 방위각을 기반으로 충격 방향 절댓값 측정
  if (returnLevel.shocklevel != 0) {
    let azimuthShockDirection = returnLevel.azimuth + returnLevel.shockDirection;
    returnLevel.azimuthShockDirection = azimuthShockDirection >= 360 ? azimuthShockDirection - 360 : azimuthShockDirection;
  }

  return returnLevel;
};
