const Member = require("../db/schema/member"); // Get member schema
const logger = require("../log/logger");
const {encryptCookie, decryptCookie} = require('./encript/encriptCookie')

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
const memberSelect = async (req, res, next) => {
    const { id, pw } = req.body;
    try {
        const member = await Member.findOne({ id, pw }); // 몽고디비의 db.users.find({}) 쿼리와 같음
        if(!member){
            res.json({answer: false});
        }
        else{
            member.str_id = member._id.toString()
            res.json({answer: true, level: member.level, userid: encryptCookie(member), username: `${member.name}#${member.hashtag.toString().padStart(4, '0')}`, userkey: member._id.toString()});
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

const levelCheck = async (req, res, next) => {
    // console.log("연결됨");
    try{
        const member = {
            id: req.body.userid,
            username:  req.body.username,
            str_id: req.body.userkey
        }
        const userid = decryptCookie(member)
        const result = await Member.findOne({id:userid});
        res.json({success: true, level: result.level});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

const checkEquals = async (req, res, next) => {
    try {
        // console.log(req.body);
        // const {name, value} = req.body;
        // console.log(value);
        // const {id, email} = req.body;
        // const membersId = await Member.findOne({id}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        // const membersEmail = await Member.findOne({email});
        const checkMember = await Member.findOne(req.body);
        // console.log(checkMember);
        let check = false;
        if(!checkMember) check = true;
        res.json({answer: check});
        // // console.log(members);
        // let isId = false;
        // let isEmail = false;
        // if(!membersId) isId = true;
        // if(!membersEmail) isEmail = true;
        // res.json({id:isId, email:isEmail});

    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {memberSelect, memberInsert, memberAdmin, memberDelete, levelCheck, checkEquals};