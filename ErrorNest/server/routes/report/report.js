const express = require('express');
const reportController = require('../../controller/report/reportController');
const router = express.Router();

/** GET /report */
// router.get('/*', reportController.documentSelect);
router.get('/getDocument/*', reportController.documentSelect);
router.post('/select/', reportController.reportSelect);
router.post('/insert/', reportController.reportInsert);
router.put('/update/', reportController.reportUpdate);


module.exports = router;