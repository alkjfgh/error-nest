const express = require('express');
const favoriteController = require('../../controller/member/favoriteController');
const router = express.Router();

/** GET /favorite */
router.post('/', favoriteController.favoriteSelect);

router.post('/update', favoriteController.favoriteUpdate)

router.post('/list', favoriteController.favoriteList)

module.exports = router;