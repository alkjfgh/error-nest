const express = require('express');
const memberController = require('../controller/memberController');
const router = express.Router();

/** POST /member */
router.post('/', memberController.memberSelect);

/** POST /test/insert  */
router.post('/insert', memberController.memberInsert);

router.get('/admin', memberController.memberAdmin);

router.delete('/delete', memberController.memberDelete);

router.post('/levelCheck', memberController.levelCheck);

router.post('/checkEquals', memberController.checkEquals);

module.exports = router;