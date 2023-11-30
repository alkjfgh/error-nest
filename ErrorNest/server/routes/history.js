const express = require('express');
const historyController = require('../controller/historyController');
const router = express.Router();

/** GET /history */
router.get('/', historyController.historyCRUD);

module.exports = router;