const member = require("../db/schema/member");
const logger = require("../log/logger");
const CryptoJS = require("crypto-js");


function decryptCookie(cipherText, key) {
    const bytes  = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

/** reportHistory CRUD */
const memberSelect = async (req, res, next) => {
    console.log("\n\n\n\n")
    console.log(`memberSelect controller 입장 성공 !!`);

    const {userid, username} = req.body

    console.log("userid: " + userid)
    console.log("username: " + username)

    const descript_userid = decryptCookie(userid, username); // 복호화
    console.log(`memberId >> ${descript_userid}`);
    try {
        const result = await member.findOne({id: descript_userid});
        console.log(`level >> ${result.level}`);

        res.json({success: true, id: descript_userid, level: result.level, message: "맴버 가져오기 성공"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, id: descript_userid, level: "noLogin", message: "맴버 가져오기 실패"});
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