const express = require('express');
const historyController = require('../../controller/document/historyController');
const router = express.Router();

/** GET /history */
router.get('/:title', historyController.historySelect);

module.exports = router;