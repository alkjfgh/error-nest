const express = require('express');
const historyController = require('../../controller/document/historyController');
const router = express.Router();

/** GET /history */
router.get('/:title', historyController.historySelect);

router.get('/:username/:hashtag', historyController.profileSelect);

router.put('/editHistory', historyController.editHistory);

module.exports = router;