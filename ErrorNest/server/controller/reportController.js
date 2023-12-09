const Report = require("../db/schema/report"); // Get report schema
const logger = require("../log/logger");
const Document = require("../db/schema/document");
const {encryptCookie, decryptCookie} = require('./encript/encriptCookie');


/** report CRUD */
const documentSelect = async (req, res, next) => {
    console.log("documentSelect Controller 진입 성공 !!");
    try {
        const title = req.params[0]
        if (req.query.version) {
            let version = parseInt(req.query.version) // 페이지 번호
            const options = {title: title}
            if (version) options.version = version
            const document = await Document.findOne(options).sort('-version') // 몽고디비의 db.users.find({}) 쿼리와 같음
            res.json({
                title: document.title,
                version: document.version,
                updateAt: document.updateAt,
                content: document.content
            });
        } else {
            res.json({title: title, version: 1, content: "", message: "문서 가져오기 성공 !!"});
        }
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({title: title, version: 1, content: "", message: "문서 가져오기 실패 !!"});
    }
}

const reportInsert = async (req, res, next) => {
    try {
        const report = req.body;
        console.log(report);

        if (report.userInfo.isLogin) {
            const member = {
                id: report.userInfo.userid,
                str_id: report.userInfo.userkey
            }
            report.userInfo.userid = decryptCookie(member);
        }

        const data = {
            title: report.title,
            comment: report.comment,
            version: report.version,
            writer: report.userInfo.userid
        }

        const result = await Report.create(data);

        res.json({success: true, message: "신고 완료 !!"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, message: "신고 오류 !!"});
    }
}

const reportSelect = async (req, res, next) => {
    try {
        res.json({success: true});
    } catch {
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {documentSelect, reportInsert, reportSelect};