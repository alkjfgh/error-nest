const File = require("../db/schema/file"); // Get file schema
const logger = require('../log/logger')

const fileUpload = async (req, res, next) => {
    try {
        const fileData = req.file;
        const fileName = fileData.originalname;
        const mimeType = fileData.mimetype;
        const size = fileData.size;
        const file = {
            fileName: req.body.fileName,
            filePath: './uploads/'+req.body.category+'/'+req.file.originalname,
            fileDes: req.body.fileDes,
            category: req.body.category
        }
        const result = await File.create(file);
        res.json({success: true});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {fileUpload};