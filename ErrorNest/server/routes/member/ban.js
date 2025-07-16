const express = require('express');
const banController = require('../../controller/member/banController');
const router = express.Router();

router.get('/:username/:hashtag', banController.isBan);

router.post('/update/:username/:hashtag', banController.banUpdate);
router.post('/targetUpdate', banController.banUpdate);

router.get('/list', banController.banList)

router.get('/history', banController.banHistory)

module.exports = router;