const Member = require("../db/schema/member"); // Get member schema
const logger = require("../log/logger");

/** member CRUD */
const memberCRUD = async (req, res, next) => {
    try {
        //sample code
        const members = await Member.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({members});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const memberInsert = async (req, res, next) => {
    try{
        const member = {
            id: req.body.id.toString(),
            pw: req.body.pw.toString(),
            email: req.body.email.toString(),
            name: req.body.name.toString()
        }
        const result = await Member.create(member);
        res.json({success: true});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {memberCRUD, memberInsert};