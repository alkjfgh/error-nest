const express = require('express');
const User = require('../db/schema/user');
const userController = require('../controller/userController');
const router = express.Router();

/** GET /user controller로 분리 */
router.get('/', userController.userFindAll);

module.exports = router;