const port = 8000; // server port
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
const cors = require('cors');

// const MongoClient = require('mongodb').MongoClient;
//
// // MongoDB URI
// const uri = 'mongodb://localhost:27017';
//
// // MongoClient 인스턴스를 생성합니다.
// const client = new MongoClient(uri);
//
// // MongoDB에 연결합니다.
// client.connect(function (err, db) {
//     if (err) throw err;
//
//     // 연결 성공!
//     console.log('MongoDB에 연결되었습니다.');
//
//     // db 인스턴스를 사용하여 MongoDB 작업을 수행할 수 있습니다.
//
//     // db.collection('users').find({}) 메서드를 사용하여 users 컬렉션의 모든 문서를 가져옵니다.
//     db.collection('users').find({}).toArray(function (err, docs) {
//         if (err) throw err;
//
//         // docs 배열에 users 컬렉션의 모든 문서가 저장됩니다.
//         console.log(docs);
//     });
// }).then(r => {
//
// });



app.use(cors());
app.use(bodyParser.json());
app.use('/user', user);

app.get('/document/:seq', async (req, res) => {
    res.json({seq : req.params.seq});
});

app.get('/', (req, res) => {
    res.send("Hello World !!!");
})

app.listen(port, () => {
    console.log(`express is running on ${port}`);
})