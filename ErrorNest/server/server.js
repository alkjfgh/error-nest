const app = require('./serverInit')
const user = require('./routes/user')
const test = require('./routes/test')
const document = require('./routes/document')
const edit = require('./routes/edit')
const history = require('./routes/history')
const search = require('./routes/search')
const report = require('./routes/report')

app.use('/user', user)
app.use('/test', test)
app.use('/document', document)
app.use('/edit', edit)
app.use('/history', history)
app.use('/search', search)
app.use('./report', report)


app.get('/', (req, res) => {
    // logger.info('GET /')
    res.send("Hello World !!!")
})