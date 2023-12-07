const express = require('express');
const reportController = require('../controller/reportController');
const router = express.Router();

/** GET /report */
router.get('/', reportController.documentSelect);
router.post('/*', reportController.reportInsert);


module.exports = router;