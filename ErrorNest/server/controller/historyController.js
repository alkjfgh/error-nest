const Document = require("../db/schema/document"); // Get history schema
const logger = require("../log/logger");

/** history CRUD */
const historySelect = async (req, res, next) => {
    try {
        const title = req.params.title
        const histories = await Document.find({title: title}) // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({histories});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {historySelect};