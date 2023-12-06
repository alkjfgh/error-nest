const Token = require("../db/schema/token"); // Get token schema
const logger = require("../log/logger");

/** token CRUD */
const tokenCRUD = async (req, res, next) => {
    // console.log("연결됨");
    // console.log(req.body.data);
    // console.log(req.body);
    try {
        const tokens = await Token.create(req.body.data);
        res.json({tokens});
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

const tokenCheck = async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.body.data);
    try{
        const tokens = await Token.findOne(req.body.data);
        if(!tokens){
            res.json({answer: false});
        }
        else{
            res.json({answer: true});
        }
    } catch (err) {
        logger.error(err);
        next(err);
        res.json({success: false});
    }
}

/** Exports CRUD functions */
module.exports = {tokenCRUD, tokenCheck};