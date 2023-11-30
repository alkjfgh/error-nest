const express = require('express');
const searchController = require('../controller/searchController');
const router = express.Router();

/** GET /search */
router.get('/search:title', searchController.searchSelect);

module.exports = router;