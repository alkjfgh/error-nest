const Test2 = require("../db/schema/test2"); // Get test2 schema
const logger = require("../log/logger");
const User = require("../db/schema/user");

/** test2 CRUD */
const test2CRUD = async (req, res, next) => {
    try {
        //sample code
        const test2s = await Test2.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({test2s});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const test2Insert = async (req, res, next) => {
    try {
        const test2 = {
            id: "abcd",
            pw: "1234"
        }
        const result = await Test2.create(test2);
        res.json(test2);
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {test2CRUD, test2Insert};