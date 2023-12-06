const express = require('express');
const test2Controller = require('../controller/test2Controller');
const router = express.Router();

/** GET /test2 */
router.get('/', test2Controller.test2Insert);
router.get('/', test2Controller.test2CRUD);

module.exports = router;