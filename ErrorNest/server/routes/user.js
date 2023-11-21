const express = require('express');
const User = require('../db/schema/user');
const userController = require('../controller/userController');
const router = express.Router();

/** GET /user controller로 분리 */
router.get('/', (req, res, next) => userController.userFindAll(req, res, next));

router.get('/insert', async (req, res, next) => {
    try {
        const user = {
            name: "유명재",
            age: 25,
            married: true,
            comment: "유명재 입니다."
        }
        const result = await User.create(user);
        res.json({success: true});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;