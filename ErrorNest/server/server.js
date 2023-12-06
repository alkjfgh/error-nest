const app = require('./serverInit');
const user = require('./routes/user');
const test = require('./routes/test');
const test2 = require('./routes/test2');
const test3 = require('./routes/test3');
const member = require('./routes/member');

app.use('/user', user);
app.use('/test', test);
app.use('/test2', test2);
app.use('/test3', test3);
app.use('/member', member);

app.get('/', (req, res) => {
    // logger.info('GET /');

    res.send("Hello World !!!");
})

app.get('/document/:seq', async (req, res) => {
    const seq = req.params.seq;
    // logger.info(`GET /document/${seq}`);
    res.json({seq : seq});
})
