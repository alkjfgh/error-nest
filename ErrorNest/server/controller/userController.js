const User = require("../db/schema/user");
const logger = require("../log/logger");

const userFindAll = async (req, res, next) => {
    try {
        const users = await User.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({users});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const userInsert = async (req, res, next) => {
    try {
        const user = {
            name: "유명재",
            age: 25,
            married: true,
            comment: "유명재 입니다."
        }
        const result = await User.create(user);
        res.json({success: true});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

module.exports = {userFindAll};