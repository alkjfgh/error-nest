const port = process.env.PORT || 8000;
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const asyncWrap = require('./error/async-wrap');
const logger = require("./log/logger");
const morganMiddleware = require('./log/morganMiddleware');
const connect = require('./db/connect');
const user = require('./routes/user');
const test = require('./routes/test');

//morgan 으로 http 요청 응답 log 출력
app.use(morganMiddleware)
app.use(cors());
app.use(bodyParser.json());
app.use('/user', user);
app.use('/test', test);

app.get('/', (req, res) => {
    // logger.info('GET /');
    res.send("Hello World !!!");
})

app.get('/document/:seq', async (req, res) => {
    const seq = req.params.seq;
    // logger.info(`GET /document/${seq}`);
    res.json({seq : seq});
})

/** express 기본적인 error 핸들링 */
app.use((err, req, res, next) => {
    logger.error(err.message);
    if (err.message === 'someError') {
        res.status(400).json({ message: "someQuery notfound." });
        return;
    }

    res.status(500).json({ message: "internal server error" });
});

/** 비동기처리 에러 핸들링 방법 */
/*app.get('/someAsyncFunc', asyncWrap(async (req, res) => {
    const { someQuery } = req.query;

    const someValue = await someAsyncFunc(someQuery);

    res.json({ result: someValue });
}));*/

app.listen(port, () => {
    logger.info(`express is running on ${port}`);
    connect();
})