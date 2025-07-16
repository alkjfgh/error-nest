const express = require('express');
const tokenController = require('../../controller/member/tokenController');
const router = express.Router();

router.post('/', tokenController.tokenCRUD);

router.post('/check', tokenController.tokenCheck);

module.exports = router;