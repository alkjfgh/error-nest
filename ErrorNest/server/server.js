const port = process.env.PORT || 8000;
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const asyncWrap = require('./error/async-wrap');
const connect = require('./db/connect');
const user = require('./routes/user');

app.use(cors());
app.use(bodyParser.json());
app.use('/user', user);
app.get('/', (req, res) => {
    res.send("Hello World !!!");
})

app.get('/document/:seq', async (req, res) => {
    res.json({seq : req.params.seq});
})

/** express 기본적인 error 핸들링 */
app.use((err, req, res, next) => {
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
    console.log(`express is running on ${port}`);
    connect();
})