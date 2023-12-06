const Report = require("../db/schema/report"); // Get report schema
const logger = require("../log/logger");
const Document = require("../db/schema/document");

/** report CRUD */
const documentSelect = async (req, res, next) => {
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
            res.json({title: title, version: 1, content: ""});
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const reportInsert = async (req, res, next) => {
    try {
        const report = req.body;
        console.log(report);

        const result = await Report.create(report);

        res.json({message: "신고 완료 !!"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {documentSelect, reportInsert};