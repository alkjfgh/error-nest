const Document = require("../../db/schema/document/document"); // Get search schema
const logger = require("../../log/logger");

/** search select all */
const searchSelect = async (req, res, next) => {
    const title = req.query.title;

    try {
        const latestDoc = await Document.findOne({ title: title }).sort('-version');
        if(latestDoc === null) res.json({title: title, searchTitle: ""});
        else res.json({title: title, searchTitle: latestDoc.title});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({title: title, searchTitle: ""});
    }
}

/** Exports CRUD functions */
module.exports = {searchSelect};