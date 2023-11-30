// const History = require("../db/schema/history"); // Get history schema
const logger = require("../log/logger");

/** history CRUD */
const historyCRUD = async (req, res, next) => {
    // try {
    //     //sample code
    //     const historys = await History.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
    //     res.json({historys});
    // } catch (err) {
    //     logger.error(err);
    //     next(err);
    // }
}

/** Exports CRUD functions */
module.exports = {historyCRUD};