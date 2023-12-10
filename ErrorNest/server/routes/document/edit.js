const express = require('express');
const editController = require('../../controller/document/editController');
const router = express.Router();

/** GET /edit */
router.get('/*', editController.documentSelect);

router.post('/*', editController.documentUpdate);

module.exports = router;