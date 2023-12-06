const Report = require("../db/schema/report"); // Get report schema
const logger = require("../log/logger");

/** report CRUD */
const reportCRUD = async (req, res, next) => {
    try {
        //sample code
        const reports = await Report.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({reports});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {reportCRUD};