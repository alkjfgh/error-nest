const Member = require("../../db/schema/member/member"); // Get member schema
const logger = require("../../log/logger");
const {encryptCookie, decryptCookie} = require('../encript/encriptCookie')

const memberAdmin = async (req, res, next) => {
    try {
        const count = await Member.countDocuments({});
        let page = parseInt(req.query.page) || 1;
        const limit = 10; // 페이지당 결과 개수
        if((page - 1) * 10 > count) page = count / limit + 1
        const skip = (page - 1) * limit; // 건너뛸 결과 개수

        const members = await Member.find({}).limit(limit).skip(skip).sort('-createdAt');; // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({members, maxPage: count/limit+1});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** member CRUD */
const memberSelect = async (req, res, next) => {
    let { id, pw, userkey, username, hashtag } = req.body;
    if(userkey){
        id = decryptCookie({id, str_id: userkey})
    }
    try {
        let member
        if(!username) member =  pw ? await Member.findOne({ id, pw }) : await Member.findOne({ id }); // 몽고디비의 db.users.find({}) 쿼리와 같음
        else member = await Member.findOne({ name: username, hashtag })
        if(!member){
            res.json({answer: false});
        }
        else{
            member.str_id = member._id.toString()
            res.json({answer: true, level: member.level, userid: encryptCookie(member), username: `${member.name}#${member.hashtag.toString().padStart(4, '0')}`, userkey: member._id.toString(), useremail: member.email});
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
    try{
        const result = await Member.deleteOne({id:req.body.id});
        res.json({success: true});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

const levelCheck = async (req, res, next) => {
    // console.log("연결됨");
    console.log(req.body);
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
        const checkMember = await Member.findOne(req.body);
        let check = false;
        if(!checkMember) check = true;
        res.json({answer: check});

    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {memberSelect, memberInsert, memberAdmin, memberDelete, levelCheck, checkEquals};