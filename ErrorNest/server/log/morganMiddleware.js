const morgan = require('morgan');
const logger = require('./logger');

// const dotenv = require('dotenv');
//
// dotenv.config(); // 노드 환경 변수 사용

const format = () => {
    // return process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    return 'combined';
};

// 로그 작성을 위한 Output stream옵션.
const stream = {
    write: (message) => {
        // console.log(message);
        logger.info(
            message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")
        );
    },
};

// 로깅 스킵 여부 (만일 배포환경이면, 코드가 400 미만라면 함수를 리턴해 버려서 로그 기록 안함. 코드가 400 이상이면 로그 기록함)
const skip = (_, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.statusCode < 400;
    }
    return false;
};
/*
morganMiddleware('dev', {
   stream = {
       write: (message) => {
          // console.log(message);
          logger.info(message);
       },
    },
   skip = (_, res) => {
      if (process.env.NODE_ENV === 'production') {
         return res.statusCode < 400;
      }
      return false;
   };
})
*/

// 적용될 moran 미들웨어 형태
const morganMiddleware = morgan(format(), { stream, skip });
module.exports = morganMiddleware;