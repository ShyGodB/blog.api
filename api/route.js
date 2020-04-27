module.exports = function () {
    const log = require('./log')
    const fs = require('fs')
    const rootPath = __dirname.substring(0, __dirname.length - 4)
    const pathDir = rootPath.indexOf('/') == 0 ? '' : '\\'
    this.apiret = async (ctx, apiControl, apiMethod) => {
        try {
            log.reqlog(ctx)
            var st = new Date().getTime()
            var js = rootPath + apiControl.substring(2) + '.js'
            var api = require.cache[pathDir ? js.replace(/\//g, pathDir) : js]
            if (!api) {
                var i = 0
                while (!fs.existsSync(rootPath + apiControl.substring(2) + '.js')) {
                    if (apiControl && (apiControl.indexOf('../src/view/') > -1 || apiControl.indexOf('../src/control/') > -1) && (i = apiControl.lastIndexOf('/')) > 6) {
                        apiMethod = apiControl.substring(i + 1)
                        apiControl = apiControl.substring(0, i)
                    } else {
                        return null
                    }
                }
            }
            api = require(apiControl)
            var method = api && api[apiMethod]
            if (api && !method) {
                for (var m in api) {
                    if (api.hasOwnProperty(m)) {
                        if (m.toLowerCase() == apiMethod) {
                            method = api[m]
                            break
                        }
                    }
                }
            }
            if (method && method.constructor) {
                var ret = ''
                if (method.constructor.name === 'AsyncFunction') {
                    ret = await method(ctx)
                } else if (method.constructor.name === 'Function') {
                    ret = await new Promise(function (res) {
                        res(method(ctx, res))
                    })
                } else {
                    throw new Error('该类型方法暂不被支持！')
                }
                log.reslog(ctx, ret, Date.now() - st)
                return ret
            }
        } catch (e) {
            log.error('接口错误！', e, {
                url: ctx.href,
                uid: ctx.userId,
                apiData: ctx.apiData
            })
        }
        log.reslog(ctx)
        return {
            msg: '服务端错误！'
        }
    }
}