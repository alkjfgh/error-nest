const Report = require("../../db/schema/report/report");
const Member = require("../../db/schema/member/member");
const logger = require("../../log/logger");
const {encryptCookie, decryptCookie} = require('../encript/encriptCookie');
const Document = require("../../db/schema/document/document");

function setPaging(count, req) {
    let page = parseInt(req.query.page) || 1;
    const limit = 10; // 페이지당 결과 개수
    if((page - 1) * 10 > count) page = count / limit + 1
    const skip = (page - 1) * limit; // 건너뛸 결과 개

    return {limit, skip}
}

/** reportHistory CRUD */
const reportSelectAll = async (req, res, next) => {
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
        console.log(reqData.userid);

        let result;
        let count = 0
        let paging

        if (reqData.isLogin) {
            if (userInfo.level === "admin"){
                count = await Report.countDocuments({});
                paging = setPaging(count, req)
                result = await Report.find({}).limit(paging.limit).skip(paging.skip).sort('-createdAt');
            }
            else{
                count = await Report.countDocuments({reportId: reqData.userid});
                paging = setPaging(count, req)
                result = await Report.find({reportId: reqData.userid}).limit(paging.limit).skip(paging.skip).sort('-createdAt');
            }
        }
        else{
            count = await Report.countDocuments({reportId: reqData.userid});
            paging = setPaging(count, req)
            result = await Report.find({reportId: reqData.userid}).limit(paging.limit).skip(paging.skip).sort('-createdAt');
        }

        console.log(count)
        console.log(result)

        res.json({success: true, result: result, writer: reqData.userid, message: "게시판 리스트 가져오기 성공", maxPage: count/paging.limit+1});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, result: null, writer: reqData.userid, message: "게시판 리스트 가져오기 실패"});
    }
}

/** Exports CRUD functions */
module.exports = {reportSelectAll};