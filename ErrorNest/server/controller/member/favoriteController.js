const Favorite = require("../../db/schema/member/favorite"); // Get favorite schema
const logger = require("../../log/logger");

/** favorite CRUD */
const favoriteSelect = async (req, res, next) => {
    const {title, target} = req.body
    try {
        const count = await Favorite.countDocuments({target, title});
        let isStar = false
        if(count > 0) isStar = true
        res.json({isStar});
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const favoriteUpdate = async (req, res, next) => {
    const {title, target} = req.body
    try {
        const count = await Favorite.countDocuments({target, title});
        if(count > 0){
            const result = await Favorite.findOneAndDelete({target, title});
            res.json({star:'☆'});
        }else{
            const result = await Favorite.create({target, title});
            res.json({star:'★'});
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

const favoriteList = async (req, res, next) => {
    const {target} = req.body
    try {
        const favorites = await Favorite.find({target});
        res.json({favorites})
    } catch (err) {
        logger.error(err);
        next(err);
    }
}

/** Exports CRUD functions */
module.exports = {favoriteSelect, favoriteUpdate, favoriteList};