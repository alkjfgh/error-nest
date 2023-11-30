const express = require('express');
const editController = require('../controller/editController');
const router = express.Router();

/** GET /edit */
router.get('/:title', editController.documentSelect);

router.post('/:title', editController.documentUpdate);

module.exports = router;