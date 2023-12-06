const Document = require("../db/schema/document"); // Get edit schema
const logger = require("../log/logger");

/** edit CRUD */
const documentSelect = async (req, res, next) => {
    try {
        const title = req.params[0]
        if(req.query.version){
            let version = parseInt(req.query.version) // 페이지 번호
            const options = { title: title }
            if(version) options.version = version
            const document = await Document.findOne(options).sort('-version') // 몽고디비의 db.users.find({}) 쿼리와 같음
            res.json({title: document.title, version: document.version, updateAt: document.updateAt, content: document.content});
        }else{
            res.json({title: title, version: 1, content: ""});
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const documentUpdate = async (req, res, next) => {
    try {
        // TODO uploads/title 폴더도 생성되도록.
        const {title, content} = req.body

        const document = {
            title: title,
            content: content,
        }
        const result = await Document.create(document)
        res.json({success: true});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {documentSelect, documentUpdate};