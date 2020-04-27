const route = require('./route')
const log = require('./log')
module.exports = (function () {
    this.base = route
    this.base()
    return async (ctx, next) => {
        if (ctx.reqType == 'api') {
            var st = new Date().getTime()
            try {
                if (ctx.method.toLowerCase() === 'options') {
                    ctx.body = 'success'
                } else {
                    ctx.body = await this.apiret(ctx, '../src/control/' + ctx.apiControl, ctx.apiMethod)
                }
            } catch (e) {
                log.error('api error', e, { url: ctx.url, apiData: ctx.apiData })
                ctx.body = { msg: '服务端错误！' }
            }
            if (new Date().getTime() - st > 2000) {
                log.apilog('api超时：', { st: st, exTime: ((new Date().getTime() - st) / 1000).toFixed(2) + ' 秒', url: ctx.url, apiData: ctx.apiData })
            }
            return
        }
        return await next()
    }
})()