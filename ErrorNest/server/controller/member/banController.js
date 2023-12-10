const Ban = require("../../db/schema/member/ban"); // Get member schema
const Member = require('../../db/schema/member/member')
const logger = require("../../log/logger");

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
    const hashtagNumber = +hashtag

    const { comment, remainDate } = req.body

    let success = false
    try {
        let target = ''
        let type = ''

        if(hashtagNumber){ // 유저
            const member = await Member.findOne({name: username, hashtag: hashtagNumber})
            target = member.id
            type = 'user'
        }else{ // IP
            target = username
            type = 'ip'
        }

        // Ban 스키마에서 target을 찾아서 업데이트하거나, 존재하지 않으면 생성
        await Ban.findOneAndUpdate(
            { target },
            {
                type,
                comment,
                remainDate,
            },
            { upsert: true }
        );

        /*// Ban 스키마에서 target을 찾아서 삭제
        await Ban.findOneAndDelete({ target })

        // 새로운 문서 생성
        await Ban.create({
            target,
            type,
            comment,
            remainDate
        })*/

        success = true

        res.json({success,target,type,comment,remainDate})
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success})
    }
}

/** Exports CRUD functions */
module.exports = {isBan, banUpdate};