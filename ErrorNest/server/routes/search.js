const express = require('express');
const searchController = require('../controller/searchController');
const router = express.Router();

/** GET /search */
router.get('/', searchController.searchSelect);

module.exports = router;