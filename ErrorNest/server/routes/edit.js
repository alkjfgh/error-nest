const express = require('express');
const editController = require('../controller/editController');
const router = express.Router();

/** GET /edit */
router.get('/', editController.editCRUD);

module.exports = router;