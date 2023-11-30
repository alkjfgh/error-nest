const Document = require("../db/schema/document"); // Get search schema
const logger = require("../log/logger");

/** search select all */
const searchSelect = async (req, res, next) => {
    const title = req.params.title;
    console.log(`title >> ${title}`);
    try {
        //sample code
        const searchResult = await Document.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        console.log(`searchResult >> ${searchResult}`);
        res.json({title: title,  search: searchResult});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {searchSelect};