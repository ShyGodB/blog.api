const parse = require('co-body')
const raw = require('raw-body')
const inflate = require('inflation')
const url = require('url')
const method = (ctx) => {
    var url = ctx.url.split('?')[0].toLowerCase()
    var actions = url.split('/')
    ctx.apiUrl = url

    ctx.apiMethod = actions[actions.length - 1] || 'index'
    ctx.apiControl = '/' + (url.replace('/' + ctx.apiMethod, '').replace('/api', '').substring(1) || 'home')
    ctx.viewUrl = 'view' + ctx.apiControl + '/' + ctx.apiMethod

    ctx.reqType = url.startsWith('/api/') ? 'api' : 'view'
}
const parseData = async (ctx) => {
    ctx.apiData = {}
    ctx.query = await url.parse(ctx.url, true).query
    if (ctx.method.toLowerCase() === 'post') {
        if (ctx.request.type == 'text/xml' || !ctx.request.type) {
            ctx.apiData = await raw(inflate(ctx.req)).then(function (str) { return str + '' })
        } else if (ctx.request.type == 'multipart/form-data') {
            var multiparty = require('multiparty')
            var form = new multiparty.Form({ autoFiles: false, autoFields: true })
            await new Promise(function (cb) {
                form.parse(ctx.req, function (err, fields, files) {
                    for (var dKey in fields) {
                        if (fields.hasOwnProperty(dKey)) {
                            ctx.apiData[dKey] = fields[dKey] instanceof Array ? fields[dKey][0] : fields[dKey]
                        }
                    }
                    for (var fKey in files) {
                        if (files.hasOwnProperty(fKey)) {
                            ctx.apiFiles = files[fKey]
                        }
                    }
                    cb(fields)
                })
            })
        } else {
            ctx.apiData = await parse(ctx, { limit: '5mb' }).catch(err => {
                console.log(err)
                return {}
            })
        }
    } else {
        ctx.apiData = ctx.query
    }
    ctx.params = ctx.apiData
    ctx.request.body = ctx.apiData
    var ip = (ctx.req.headers['x-forwarded-for'] ||
        ctx.req.connection.remoteAddress ||
        ctx.req.socket.remoteAddress ||
        ctx.req.connection.socket && ctx.req.connection.socket.remoteAddress).replace('::ffff:', '')
    ip = ip.replace('127.0.0.1', '').split(',')
    for (var i = 0; i < ip.length; i++) {
        if (ip[i]) {
            ip[i] = ip[i].replace(/ /g, '')
        }
    }
    ctx.Ip = ip[0]
}
module.exports = async (ctx, next) => {
    method(ctx)
    await parseData(ctx)
    await next()
}