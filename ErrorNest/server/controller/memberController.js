const Member = require("../db/schema/member"); // Get member schema
const logger = require("../log/logger");

const memberAdmin = async (req, res, next) => {
    // console.log("admin 들어옴");
    try {
        //sample code
        const members = await Member.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({members});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** member CRUD */
const memberCRUD = async (req, res, next) => {
    const { id, pw } = req.body;
    try {
        const members = await Member.findOne({ id, pw }); // 몽고디비의 db.users.find({}) 쿼리와 같음
        if(!members){
            res.json({answer: false});
        }
        else{
            res.json({answer: true, level: members.level, userid: members.id});
        }

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

const memberDelete = async (req, res, next) => {
    // console.log(req.body);
    try{
        // console.log(req.body.id);
        const result = await Member.deleteOne(req.body);
        res.json({success: true});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {memberCRUD, memberInsert, memberAdmin, memberDelete};