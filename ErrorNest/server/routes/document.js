const express = require('express');
const documentController = require('../controller/documentController');
const app = require("../serverInit");
const router = express.Router();

/** GET /document */
router.get('/:title', documentController.documentSelect);

module.exports = router;