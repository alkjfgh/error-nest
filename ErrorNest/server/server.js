const express = require("express");
const app = express();

const bodyParser = require('body-parser');

const port = 8000; // server port

app.use(bodyParser.json());
// app.use('/api', board);

app.get('/', (req, res) => {
    res.send("Hello World !!!");
})

app.listen(port, () => {
    console.log(`express is running on ${port}`);

})