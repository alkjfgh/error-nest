const Document = require("../db/schema/document"); // Get history schema
const logger = require("../log/logger");

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

/** Exports CRUD functions */
module.exports = {historySelect};