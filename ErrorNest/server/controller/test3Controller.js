const Test3 = require("../db/schema/test3"); // Get test3 model
// Test3 모델
const logger = require("../log/logger");

/** test3 CRUD */
const test3CRUD = async (req, res, next) => {
    try {
        //sample code
        const test3s = await Test3.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({test3s});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const test3Insert = async (req, res, next) => {
    try{
        const test3 = {
            id: "zxcv",
            pw: "1234"
        }
        // Test3 = Model = 도구 / 형태지정 도구
        // create는 mongooese에 존재하는 함수 (함수 = 도구)
        // mongodb => 냅다 들어감 = 문제임
        // 형태 지정 하기 위해 몽고스 사용 (connect => 스키마 생성 => 모델 => 넣을내용과 함께 쓸 수 있는 함수(=도구,CREATE) 랑 같이 사용)

        // 1. connect => connect.js
        // node ./MVCInit.js {name}
        // 2. 스키마 생성 => schema/test3.js _ export 모델 내보냄
        // 3. db 이용해보자 => 몽고스 함수 + 내용(PUT,DELETE,UPDATE,INSERT) => controller/test3Controller.js

        const result = await Test3.create(test3);
    } catch(err){
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {test3CRUD, test3Insert};