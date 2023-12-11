const Document = require("../../db/schema/document/document"); // Get history schema
const logger = require("../../log/logger");

/** history CRUD */
const historySelect = async (req, res, next) => {
    try {
        const title = req.params.title
        const count = await Document.countDocuments({title: title});
        let page = parseInt(req.query.page) || 1; // 페이지 번호
        const limit = 10; // 페이지당 결과 개수
        if((page - 1) * 10 > count) page = count / limit + 1
        const skip = (page - 1) * limit; // 건너뛸 결과 개수

        const histories = await Document.find({title: title}).limit(limit).skip(skip).sort('-version'); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({title, histories, maxPage: count/limit+1});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

// 프로필에서 작성자가 적은 글만 찾아오기
const profileSelect = async (req, res, next) => {
    // console.log(req.params);
    try{
        const {username, hashtag} = req.params
        // const hashtagNum = +hashtag;  // hashtag 0001을 1로 변환
        let data = username;
        if(hashtag !== "undefined") data = username + "#" + hashtag;

        const count = await Document.countDocuments({writer: data});
        let page = parseInt(req.query.page) || 1;
        const limit = 10; // 페이지당 결과 개수
        if((page - 1) * 10 > count) page = count / limit + 1
        const skip = (page - 1) * limit; // 건너뛸 결과 개수
        // console.log(page);
        // console.log(count);
        // console.log(data);

        const writtenList = await Document.find({writer: data}).limit(limit).skip(skip).sort('-version');

        // console.log(writtenList);
        // console.log(writtenList.title)

        res.json({writtenList, maxPage: count/limit+1});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {historySelect, profileSelect};