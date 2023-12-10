const express = require('express');
const banController = require('../../controller/member/banController');
const router = express.Router();

router.get('/:username/:hashtag', banController.isBan);

router.post('/update/:username/:hashtag', banController.banUpdate);

module.exports = router;