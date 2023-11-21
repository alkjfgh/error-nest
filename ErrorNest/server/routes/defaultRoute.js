const express = require('express');
const schemanameController = require('../controller/schemanameController');
const router = express.Router();

/** GET /schemaname */
router.get('/', schemanameController.schemaNameCRUD);

module.exports = router;