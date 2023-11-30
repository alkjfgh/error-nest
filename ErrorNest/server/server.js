const app = require('./serverInit')
const user = require('./routes/user')
const test = require('./routes/test')
const document = require('./routes/document')
const edit = require('./routes/edit')
const history = require('./routes/history')

app.use('/user', user)
app.use('/test', test)
app.use('/document', document)
app.use('/edit', edit)
app.use('/history', history)


app.get('/', (req, res) => {
    // logger.info('GET /')
    res.send("Hello World !!!")
})

// app.get('/document/:seq', async (req, res) => {
//     const seq = req.params.seq
//     // logger.info(`GET /document/${seq}`)
//     res.json({seq : seq})
// })
