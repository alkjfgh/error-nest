const port = 8000; // server port
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
// const cors = require('cors');

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
    // Your database operations go here
}).then(r => {
});

// app.use(cors());
app.use(bodyParser.json());
app.use('/user', user);

app.get('/', (req, res) => {
    res.send("Hello World !!!");
})

app.listen(port, () => {
    console.log(`express is running on ${port}`);
})