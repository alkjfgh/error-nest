const File = require("../../db/schema/document/file"); // Get file schema
const logger = require('../../log/logger')

const fileUpload = async (req, res, next) => {
    try {
        const fileData = req.file;
        const fileName = fileData.originalname;
        const mimeType = fileData.mimetype;
        const size = fileData.size;
        const file = {
            fileName: req.body.fileName,
            filePath: './uploads/'+req.body.category+'/'+req.file.originalname,
            // filePath: req.file.location,
            fileDes: req.body.fileDes,
            category: req.body.category
        }
        const result = await File.create(file);
        res.json({success: true, fileName: file.fileName});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false})
    }
}

/** Exports CRUD functions */
module.exports = {fileUpload};