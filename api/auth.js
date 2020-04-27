
const api = require('./index')
const checkToken = (token) => {
    try {
        if (!token) return ''
        var v = api.crypto.aesDecrypt(token, config.authToken)
        if (!v.startsWith('t')) {
            return ''
        }
        return v.substring(4)
    } catch (e) {
        console.log(e)
    }
    return ''
}

const getToken = (uid) => {
    var s = 't' + new Date().getMilliseconds() + '0000'
    return api.crypto.aesEncrypt(s.substring(0, 4) + uid, config.authToken)
}

const getAuthtoken = (ctx) => {
    let token = ctx.get('authtoken') || ctx.req.headers.authtoken || ctx.cookies.get('authtoken')
    token = token && checkToken(token) || ''
    ctx.userId = parseInt(token) || token || ''
}

const setAuthtoken = (ctx) => {
    if (ctx.authData) {
        ctx.body.authtoken = getToken(ctx.authData)
    }
    if (ctx.authCookie) {
        ctx.cookies.set('authtoken', getToken(ctx.authCookie), { httpOnly: false })
    }
}

module.exports = async (ctx, next) => {
    getAuthtoken(ctx)
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type,Accept,authtoken')
    await next()
    setAuthtoken(ctx)
}