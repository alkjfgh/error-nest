const express = require('express');
const documentController = require('../controller/documentController');
const app = require("../serverInit");
const router = express.Router();

/** GET /document */
router.get('/:title', documentController.documentSelect);
// router.get('/test', documentController.documentInsert);

module.exports = router;