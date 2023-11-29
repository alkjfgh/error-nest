const app = require('./serverInit')
const user = require('./routes/user')
const test = require('./routes/test')
const document = require('./routes/document')

app.use('/user', user)
app.use('/test', test)
app.use('/document', document)

app.get('/', (req, res) => {
    // logger.info('GET /')
    res.send("Hello World !!!")
})

// app.get('/document/:seq', async (req, res) => {
//     const seq = req.params.seq
//     // logger.info(`GET /document/${seq}`)
//     res.json({seq : seq})
// })
