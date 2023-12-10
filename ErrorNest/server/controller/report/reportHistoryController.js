const Report = require("../../db/schema/report/report");
const logger = require("../../log/logger");
const {encryptCookie, decryptCookie} = require('../encript/encriptCookie');

/** reportHistory CRUD */
const reportSelectAll = async (req, res, next) => {
    console.log(`reportSelect controller 입장 성공 !!\n\n`);
    const userInfo = req.body;
    console.log(userInfo);

    if (userInfo.isLogin) {
        const member = {
            id: userInfo.userid,
            str_id: userInfo.userkey
        }
        userInfo.userid = decryptCookie(member);
    }

    console.log("--- decryption result ---");
    console.log(userInfo);

    try {
        let result = [];

        if (userInfo.username === "관리자")
            result = await Report.find({});
        else
            result = await Report.find({writer: userInfo.userid});

        console.log("---- result ----");
        console.log(result);

        res.json({success: true, result: result, writer: userInfo.userid, message: "게시판 리스트 가져오기 성공"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, result: null, writer: userInfo.userid, message: "게시판 리스트 가져오기 실패"});
    }
}

/** Exports CRUD functions */
module.exports = {reportSelectAll};