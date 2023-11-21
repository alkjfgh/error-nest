const express = require('express');
const Test = require('../db/schema/test');
const testController = require('../controller/testController');
const router = express.Router();

/** GET /test controller로 분리 */
router.get('/', (req, res, next) =>
    testController.testFindAll(req, res, next)
);

router.post('/insert',(req, res, next) =>
    testController.testInsert(req, res, next)
);

module.exports = router;