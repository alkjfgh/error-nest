const express = require('express');
const reportController = require('../../controller/report/reportController');
const router = express.Router();

/** GET /report */
// router.get('/*', reportController.documentSelect);
router.post('/getDocument/', reportController.documentSelect);

router.post('/select/', reportController.reportSelect);

router.post('/insert/', reportController.reportInsert);

router.put('/update/', reportController.reportUpdate);

router.put('/updateCancel/', reportController.reportUpdateCancel);


module.exports = router;