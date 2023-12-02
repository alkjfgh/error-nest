const express = require('express');
const documentController = require('../controller/documentController');
const router = express.Router();

/** GET /document */
// router.get('/:title', documentController.documentSelect);
/** 중간에 / 들어가도 되도록 변경*/
router.get('/*', documentController.documentSelect);

// router.get('/test', documentController.documentInsert);

module.exports = router;