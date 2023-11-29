const Document = require("../db/schema/document") // Get document schema
const logger = require("../log/logger")

/** document CRUD */
const documentSelect = async (req, res, next) => {
    const title = req.params.title
    try {
        const document = await Document.findOne({ title: title}) // 몽고디비의 db.users.find({}) 쿼리와 같음
        // console.log(document)
        res.json({title: title, content: document.content})
    } catch (err) {
        logger.error(err)
        next(err)
    }
}

/** Exports CRUD functions */
module.exports = {documentSelect: documentSelect}