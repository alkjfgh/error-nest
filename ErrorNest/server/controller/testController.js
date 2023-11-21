const Test = require("../db/schema/test");

const testFindAll = async (req, res, next) => {
    try {
        const tests = await Test.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({tests});
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const testInsert = async (req, res, next) => {
    try {
        const test = {
            id: req.body.id.toString(),
            pw: req.body.pw.toString()
        }
        const result = await Test.create(test);
        res.json({success: true});
    } catch (err) {
        console.error(err);
        next(err);
        res.json({success: false});
    }
}

module.exports = {testFindAll, testInsert};