const ReportHistory = require("../db/schema/reportHistory"); // Get reportHistory schema
const logger = require("../log/logger");

/** reportHistory CRUD */
const reportSelect = async (req, res, next) => {
    try {
        res.json({success: true, message: "신고 리스트 가져오기 성공 !!"});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false, message: "신고 리스트 가져오기 오류 !!"});
    }
}

/** Exports CRUD functions */
module.exports = {reportSelect};