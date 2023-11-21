const User = require("../db/schema/user");

const userFindAll = async (req, res, next) => {
    try {
        const users = await User.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({users});
    } catch (err) {
        console.error(err);
        next(err);
    }
}

module.exports = {userFindAll};