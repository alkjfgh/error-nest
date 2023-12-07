const member = require("../db/schema/member");
const logger = require("../log/logger");

/** reportHistory CRUD */

const memberSelect = async (req, res, next) => {
    console.log(`memberSelect controller 입장 성공 !!`);

    try {
        const memberId = req.query;
        console.log(memberId);

        const result = await member.findOne(memberId);
        console.log(result);
        console.log(`level >> ${result.level}`);

        res.json({success: true, level: result.level, message: "맴버 가져오기 성공"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, level: "noLogin", message: "맴버 가져오기 실패"});
    }
}
const reportSelect = async (req, res, next) => {
    console.log(`reportSelect controller 입장 성공 !!`);
    console.log(`writer >> ${req.query.writer}`);

    try {
        res.json({success: true, message: "신고 리스트 가져오기 성공 !!"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, message: "신고 리스트 가져오기 오류 !!"});
    }
}

/** Exports CRUD functions */
module.exports = {memberSelect, reportSelect};