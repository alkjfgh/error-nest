const express = require('express');
const reportController = require('../controller/reportController');
const router = express.Router();

/** GET /report */
// router.get('/*', reportController.documentSelect);
router.get('/getDocument/*', reportController.documentSelect);
router.post('/insert/', reportController.reportInsert);


module.exports = router;