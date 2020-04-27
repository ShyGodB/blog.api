require('./index')
const Koa = require('koa')
const routeApi = require('./api/routeApi')
const res = require('./api/res')
const validate = require('koa-validate')
const auth = require('./api/auth')
const parse = require('./api/parse')
const apiAuth = require('./src/util/apiAuth')
const db = require('./src/util/db')
const app = new Koa()

app.use(auth)
    .use(parse)
    .use(apiAuth)
    .use(routeApi)
    .use(res)
validate(app)


app.listen(global.serverPort, function () {
    log.info('程序已经启动 http://localhost:' + server.address().port)
})