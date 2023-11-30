const Edit = require("../db/schema/edit"); // Get edit schema
const logger = require("../log/logger");

/** edit CRUD */
const editCRUD = async (req, res, next) => {
    try {
        //sample code
        const edits = await Edit.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({edits});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {editCRUD};