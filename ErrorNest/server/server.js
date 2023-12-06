const app = require('./serverInit')
const document = require('./routes/document')
const edit = require('./routes/edit')
const history = require('./routes/history')
const search = require('./routes/search')
const upload = require('./routes/upload')
const member = require('./routes/member')

app.use('/document', document)
app.use('/edit', edit)
app.use('/history', history)
app.use('/search', search)
app.use('/upload', upload)
app.use('/member', member)

app.get('/', (req, res) => {
    // logger.info('GET /')
    res.send("Hello World !!!")
})