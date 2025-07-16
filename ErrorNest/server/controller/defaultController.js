const schemaname = require("../db/schema/schemaname"); // Get schemaname schema
const logger = require("../log/logger");

/** SchemaName CRUD */
const schemaNameCRUD = async (req, res, next) => {
    try {
        //sample code
        const schemanames = await schemaname.find({}); // 몽고디비의 db.users.find({}) 쿼리와 같음
        res.json({schemanames});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {schemaNameCRUD};