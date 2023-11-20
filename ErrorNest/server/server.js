const port = 8000; // server port
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
const cors = require('cors');
const connect = require('./db/connect');

app.use(cors());
app.use(bodyParser.json());
app.use('/user', user);
app.get('/', (req, res) => {
    res.send("Hello World !!!");
})

app.get('/document/:seq', async (req, res) => {
    res.json({seq : req.params.seq});
});

app.listen(port, () => {
    console.log(`express is running on ${port}`);
    connect();
})