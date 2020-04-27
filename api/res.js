const send = require('koa-send')
module.exports = async (ctx, next) => {
    if (ctx.method.toLowerCase() == 'get') {
        if (ctx.path.startsWith('/res/') && (ctx.path.includes('.jks') || ctx.path.includes('.png') || ctx.path.includes('.jpg'))) {
            let r = await send(ctx, ctx.path.substring(4), { root: './res' })
            if (r) {
                return
            }
        }
        let r = await send(ctx, ctx.path, { root: './public' }).catch(err => err)
        if (r && r.status != 404) {
            return
        }
    }
    return await next()
}