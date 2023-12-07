const Member = require("../db/schema/member"); // Get member schema
const logger = require("../log/logger");
const CryptoJS = require('crypto-js');

function encryptCookie(value, key) {
    return CryptoJS.AES.encrypt(value, key).toString();
}

function decryptCookie(cipherText, key) {
    const bytes  = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

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
        const members = await Member.findOne({ id, pw }); // 몽고디비의 db.users.find({}) 쿼리와 같음
        if(!members){
            res.json({answer: false});
        }
        else{
            res.json({answer: true, level: members.level, userid: encryptCookie(members.id, members.name), name: members.name});
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
        const userid = decryptCookie(req.body.userid, req.body.username)
        const result = await Member.findOne({id:userid});
        res.json({success: true, level: result.level});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

const checkId = async (req, res, next) => {
    console.log(req.body);
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