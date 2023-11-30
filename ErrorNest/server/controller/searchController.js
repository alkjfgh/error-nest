const Document = require("../db/schema/document"); // Get search schema
const logger = require("../log/logger");

/** search select all */
const searchSelect = async (req, res, next) => {
    const title = req.query.title;
    console.log(`result >> ${title}`);

    try {
        const latestDoc = await Document.findOne({ title: title }).sort('-version');
        console.log(`latestDoc >> ${latestDoc}`);
        console.log(`latestDoc.content >> ${latestDoc.title}`);
        res.json({title: title, searchTitle: latestDoc.title});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({title: title, searchTitle: ""});
    }
}

/** Exports CRUD functions */
module.exports = {searchSelect};