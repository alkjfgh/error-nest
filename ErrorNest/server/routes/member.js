const express = require('express');
const memberController = require('../controller/memberController');
const router = express.Router();

/** POST /member */
router.post('/', memberController.memberSelect);

/** POST /test/insert  */
router.post('/insert', memberController.memberInsert);

router.get('/admin', memberController.memberAdmin);

router.delete('/delete', memberController.memberDelete);

module.exports = router;