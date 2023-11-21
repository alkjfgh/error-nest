const express = require('express');
const testController = require('../controller/testController');
const router = express.Router();

/** GET /test */
router.get('/', testController.testFindAll);

/** POST /test/insert  */
router.post('/insert', testController.testInsert);

module.exports = router;