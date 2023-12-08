const Member = require("../db/schema/member"); // Get member schema
const logger = require("../log/logger");
const CryptoJS = require('crypto-js');
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
            res.json({answer: true, level: member.level, userid: encryptCookie(member), username: member.name, userkey: member._id.toString()});
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

const checkId = async (req, res, next) => {
    try {
        const members = await Member.findOne(req.body); // 몽고디비의 db.users.find({}) 쿼리와 같음
        // console.log(members);
        if(!members){
            res.json({answer: true});
        }
        else{
            // console.log(members);
            res.json({answer: false});
        }
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {memberSelect, memberInsert, memberAdmin, memberDelete, levelCheck, checkId};