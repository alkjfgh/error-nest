const express = require('express');
const reportHistoryController = require('../controller/reportHistoryController');
const router = express.Router();

/** GET /reportHistory */
// router.get('/', reportHistoryController.reportSelect);
router.post('/getMember', reportHistoryController.memberSelect);

module.exports = router;