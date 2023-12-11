const Report = require("../../db/schema/report/report"); // Get report schema
const Member = require("../../db/schema/member/member");
const logger = require("../../log/logger");
const Document = require("../../db/schema/document/document");
const {encryptCookie, decryptCookie} = require('../encript/encriptCookie');


/** report CRUD */
const documentSelect = async (req, res, next) => {
    console.log("documentSelect Controller 진입 성공 !!");
    const title = req.params[0]
    try {
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

        await Report.create(data);

        res.json({success: true, message: "신고 완료 !!"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, message: "신고 오류 !!"});
    }
}

const reportSelect = async (req, res, next) => {
    const data = req.body;

    try {
        if (data.isLogin) {
            const member = {
                id: data.userid,
                str_id: data.userkey
            };
            data.userid = decryptCookie(member);
        }

        const userInfo = await Member.findOne({id: data.userid});
        console.log('------------------------');
        console.log(userInfo);

        const reportInfo = await Report.findOne({writer: data.writer, reportNo: data.reportNo});
        console.log('------------------------');
        console.log(reportInfo);


        res.json({success: true, message: "reportSelect 성공", userLevel: userInfo.level, reportInfo: reportInfo});
    } catch {
        res.json({success: false, message: "reportSelect 실패"});
    }
}

/** Exports CRUD functions */
module.exports = {documentSelect, reportInsert, reportSelect};