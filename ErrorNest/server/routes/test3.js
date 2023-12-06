const express = require('express');
const test3Controller = require('../controller/test3Controller');
const router = express.Router();

/** GET /test3 */
router.get('/', test3Controller.test3Insert);

module.exports = router;