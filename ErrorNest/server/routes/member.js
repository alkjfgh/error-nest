const express = require('express');
const memberController = require('../controller/memberController');
const router = express.Router();

/** GET /member */
router.post('/', memberController.memberCRUD);

/** POST /test/insert  */
router.post('/insert', memberController.memberInsert);

module.exports = router;