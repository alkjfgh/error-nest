const Report = require("../db/schema/report");
const logger = require("../log/logger");
const CryptoJS = require("crypto-js");


function decryptCookie(cipherText, key) {
    const bytes  = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

/** reportHistory CRUD */
const reportSelect = async (req, res, next) => {
    console.log(`reportSelect controller 입장 성공 !!\n\n`);
    const userInfo = req.body;
    console.log(userInfo);

    if (userInfo.isLogin)
        userInfo.userid = decryptCookie(userInfo.userid, userInfo.username);

    console.log("--- decryption result ---");
    console.log(userInfo);

    try {
        const result = await Report.find({writer: userInfo.userid});
        console.log("---- result ----");
        console.log(result);

        res.json({success: true, result: result, message: "게시판 리스트 가져오기 성공"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, result: null, message: "게시판 리스트 가져오기 실패"});
    }
}

/** Exports CRUD functions */
module.exports = {reportSelect};