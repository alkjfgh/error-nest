const express = require('express');
const reportHistoryController = require('../../controller/report/reportHistoryController');
const router = express.Router();

/** GET /reportHistory */
// router.get('/', reportHistoryController.reportSelect);
router.post('/getReportList', reportHistoryController.reportSelectAll);

module.exports = router;