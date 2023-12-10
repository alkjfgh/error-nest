const Report = require("../../db/schema/report/report");
const Member = require("../../db/schema/member/member");
const logger = require("../../log/logger");
const {encryptCookie, decryptCookie} = require('../encript/encriptCookie');

/** reportHistory CRUD */
const reportSelectAll = async (req, res, next) => {
    console.log(`reportSelect controller 입장 성공 !!\n\n`);
    const reqData = req.body;
    console.log(reqData);

    if (reqData.isLogin) {
        const member = {
            id: reqData.userid,
            str_id: reqData.userkey
        }
        reqData.userid = decryptCookie(member);
    }

    try {
        const userInfo = await Member.findOne({id: reqData.userid});
        console.log("---- userInfo ----");
        console.log(userInfo);
        let result = [];

        if (userInfo.level === "admin")
            result = await Report.find({});
        else
            result = await Report.find({writer: reqData.userid});

        res.json({success: true, result: result, writer: reqData.userid, message: "게시판 리스트 가져오기 성공"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, result: null, writer: reqData.userid, message: "게시판 리스트 가져오기 실패"});
    }
}

/** Exports CRUD functions */
module.exports = {reportSelectAll};