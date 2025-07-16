const express = require('express');
const searchController = require('../../controller/document/searchController');
const router = express.Router();

/** GET /search */
router.get('/', searchController.searchSelect);

module.exports = router;