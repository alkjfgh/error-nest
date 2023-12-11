const Report = require("../../db/schema/report/report"); // Get report schema
const Member = require("../../db/schema/member/member");
const logger = require("../../log/logger");
const Document = require("../../db/schema/document/document");
const {encryptCookie, decryptCookie} = require('../encript/encriptCookie');


/** report CRUD */

/** documentSelect: 완료 */
const documentSelect = async (req, res, next) => {
    console.log(req.body);
    let documentInfo;

    try {
        if (req.body.version) {
            let version;
            if (req.body.version !== "null") {
                version = parseInt(req.body.version);
                documentInfo = await Document.findOne({title: req.body.title, version: version});
            } else {
                documentInfo = await Document.findOne({title: req.body.title}).sort('-version');
            }
            console.log(documentInfo);

            res.json({title: documentInfo.title, version: documentInfo.version, myName: req.body.username});
        }
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({message: "문서 가져오기 실패 !!"});
    }
}

/** reportInsert 완료 */
const reportInsert = async (req, res, next) => {
    try {
        console.log(req.body);

        const data = {
            title: req.body.title,
            comment: req.body.comment,
            version: req.body.version,
            writer: req.body.username
        }

        await Report.create(data);

        res.json({success: true, message: "신고 완료 !!"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, message: "신고 오류 !!"});
    }
}

/** reportSelect 시작 */
const reportSelect = async (req, res, next) => {
    const reqData = req.body;

    let userInfo;
    let reportInfo;

    try {
        if (reqData.isLogin) {
            const member = {
                id: reqData.userid,
                str_id: reqData.userkey
            };
            reqData.userid = decryptCookie(member);
            userInfo = await Member.findOne({id: reqData.userid});

            console.log('------------------------');
            console.log(userInfo);
        }

        reportInfo = await Report.findOne({writer: reqData.writer, reportNo: reqData.reportNo});
        console.log('------------------------');
        console.log(reportInfo);
        
        console.log(`userLevel: ${userInfo.level}`);
        console.log(`username: ${userInfo.name}`);


        res.json({ message: "reportSelect 성공", isLogin: reqData.isLogin, userLevel: userInfo.level, username: userInfo.name, hashtag: userInfo.hashtag, reportInfo: reportInfo});
    } catch {
        res.json({isLogin: reqData.isLogin, reportInfo: reportInfo, message: "reportSelect 실패"});
    }
}

const reportUpdate = async (req, res, next) => {
    console.log(req.body);

    const filter = {writer: req.body.writer, reportNo: req.body.reportNo};
    const update = {$set: {adminComment: req.body.adminComment, status: "완료"}};

    console.log(filter);
    console.log(update);

    try{
        await Report.updateOne(filter, update);
        res.json({message: "신고 상태가 완료로 변경되었습니다."});
    } catch {  
        res.json({message: "상태 완료 오류"});
    }
}

const reportUpdateCancel = async (req, res, next) => {
    console.log(req.body);

    try{
        // await Report.updateOne(filter, update);
        res.json({message: "취소 완료"});
    } catch {
        res.json({message: "취소 완료 오류"});
    }
}

/** Exports CRUD functions */
module.exports = {documentSelect, reportInsert, reportSelect, reportUpdate, reportUpdateCancel};