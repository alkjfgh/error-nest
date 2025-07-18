const app = require('./serverInit')
const document = require('./routes/document/document')
const edit = require('./routes/document/edit')
const history = require('./routes/document/history')
const search = require('./routes/document/search')
const upload = require('./routes/document/upload')
const member = require('./routes/member/member')
const report = require('./routes/report/report')
const token = require('./routes/member/token');
const reportHistory = require('./routes/report/reportHistory');
const ban = require('./routes/member/ban')
const favorite = require('./routes/member/favorite')

app.use('/document', document)
app.use('/edit', edit)
app.use('/history', history)
app.use('/search', search)
app.use('/upload', upload)
app.use('/member', member)
app.use('/report', report)
app.use('/token', token)
app.use('/reportHistory', reportHistory);
app.use('/ban', ban)
app.use('/favorite', favorite)