const Ban = require("../../db/schema/member/ban");
const Member = require("../../db/schema/member/member")
const logger = require("../../log/logger");
const BanHistory = require("../../db/schema/member/banHistory")

const isBan = async (req, res, next) => {
    const { username, hashtag } = req.params
    const hashtagNumber = +hashtag;

    try {
        let data = {}
        let target = ''

        if(hashtagNumber){ // 유저
            const member = await Member.findOne({name: username, hashtag: hashtagNumber})
            target = member.id
        }else target = username // IP

        const ban = await Ban.findOne({target})
        if(ban){
            data = {
                isBan: true,
                comment: ban.comment,
                remainDate: ban.remainDate,
                status: ban.status,
                createdAt: ban.createdAt,
                expireAt: ban.expireAt,
            }
        }else data.isBan = false

        res.json(data)
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const banUpdate = async (req, res, next) => {
    const { username, hashtag } = req.params
    const hashtagNumber = +hashtag || undefined

    const { comment, remainDate } = req.body
    const remainDateNum = +remainDate

    const {targetId} = req.body

    let success = false
    try {
        let target = ''
        let type = ''

        if(!targetId){
            if(hashtagNumber){ // 유저
                const member = await Member.findOne({name: username, hashtag: hashtagNumber})
                target = member.id
                type = 'user'
            }else{ // IP
                target = username
                type = 'ip'
            }
        }else{
            target = targetId
            type = 'user'
        }

        // Ban 스키마에서 target을 찾아서 삭제
        await Ban.findOneAndDelete({ target })

        if(remainDateNum > 0){
            // 새로운 문서 생성
            await Ban.create({
                target,
                type,
                comment,
                remainDate
            })
        }

        success = true

        res.json({success})
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success})
    }
}

const banList = async (req, res, next) => {
    try {
        const count = await Ban.countDocuments({});
        let page = parseInt(req.query.page) || 1;
        const limit = 10; // 페이지당 결과 개수
        if((page - 1) * 10 > count) page = count / limit + 1
        const skip = (page - 1) * limit; // 건너뛸 결과 개수

        const banList = await Ban.find({}).limit(limit).skip(skip).sort('-createdAt') // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({banList, maxPage: count/limit+1});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const banHistory = async (req, res, next) => {
    try {
        const count = await BanHistory.countDocuments({});
        let page = parseInt(req.query.page) || 1;
        const limit = 10; // 페이지당 결과 개수
        if((page - 1) * 10 > count) page = count / limit + 1
        const skip = (page - 1) * limit; // 건너뛸 결과 개수

        const banHistories = await BanHistory.find({}).limit(limit).skip(skip).sort('-createdAt') // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({banHistories, maxPage: count/limit+1});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {isBan, banUpdate, banList, banHistory};