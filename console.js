require('./index')
const db = require('./src/util/db')

let controlName = (process.argv[2] || '').split('/')
let methodName = controlName[1] || 'index'
controlName = controlName[0] || 'home'
let args = process.argv.slice(4)

let control = require('./src/console/' + controlName)
let method = control[methodName]
if (!method) {
    process.exit(0)
    return
}
(async () => {
    redis.init(config.redis)
    await db.connect()
    const startTime = Date.now()
    console.info('\r\n\r\n---任务开始')
    await method(...args)
    const time = Date.now() - startTime
    const day = parseInt(time / 86400000)
    const h = parseInt(time % 86400000 / 3600000)
    const m = parseInt(time % 3600000 / 60000)
    const s = parseInt(time % 60000 / 1000)
    console.info(`---${new Date().format('yyyy-MM-dd hh:mm:ss')} ${controlName}/${methodName} ${day}天 ${h}时 ${m}分 ${s}秒`)
    process.exit(0)
})()