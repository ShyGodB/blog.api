const fs = require('fs')
const pion = require('pino')
const logConfig = global.config && global.config.log || {}
const pionLog = {}

console.req = function (...args) {
    console.log('\x1B[32m', ...args)
}

console.res = function (...args) {
    console.log('\x1B[34m', ...args)
}

console.api = function (...args) {
    console.log('\x1B[33m', ...args)
}

console.info = function (...args) {
    console.log('\x1B[1m', ...args)
}

module.exports = new (function () {
    function _log(type, msg, data, e, args) {
        if (global.env == 'dev' && process.env.HOME != '/root') {
            const txt = `\r\n${instanceId} ${new Date().format('yyyy-MM-dd hh:mm:ss')} ---`
            console[type] ? console[type](txt, msg, data || '', e || '', ...args) : console.log(txt, msg, data || '', ...args)
            return
        }
        let day = new Date().format('yyyy-MM-dd')
        let log = pionLog[type + day] || (pionLog[type + day] = pion({
            timestamp: () => {
                return `,"time":"${new Date().format('yyyy-MM-dd hh:mm:ss')}"`
            }
        }, `./log/${type}/${new Date().format('yyyy-MM-dd')}.log`))
        switch (type) {
        case 'error':
            msg += ' ' + (e && e.message || JSON.stringify(e) || '')
            log.error(msg, e && e.stack || '', data || '', ...args)
            break
        case 'warn':
            log.warn(msg, data, e, ...args)
            break
        default:
            log.info(msg, data, e, ...args)
            break
        }
    }
    this.reqlog = (ctx) => {
        config.log && config.log.req && _log('req', 'reqlog', {
            apiUrl: ctx.apiUrl,
            uid: ctx.userId,
            ip: ctx.Ip,
            data: ctx.apiData,
            url: ctx.href
        }, '', [])
    }
    this.reslog = (ctx, body, time) => {
        config.log && config.log.res && _log('res', 'reslog:' + time, {
            apiUrl: ctx.apiUrl,
            uid: ctx.userId,
            ip: ctx.Ip,
            data: ctx.apiData,
            url: ctx.href,
            body: body || ctx.body
        }, '', [])
    }
    this.apilog = (msg, data, ...args) => {
        config.log && config.log.api && _log('api', msg, data, '', args)
    }
    this.error = (msg, e, data, ...args) => {
        config.log && config.log.error && _log('error', msg, data, e, args)
    }
    this.warn = (msg, data, ...args) => {
        config.log && config.log.warn && _log('warn', msg, data, '', args)
    }
    this.info = (msg, data, ...args) => {
        config.log && config.log.info && _log('info', msg, data, '', args)
    }
    this.log = (msg, data, ...args) => {
        _log('info', msg, data, '', args)
    }

    function _checkDir() {
        if (!fs.existsSync('./log/')) {
            fs.mkdirSync('./log/')
        }
        for (const key in logConfig) {
            if (!fs.existsSync('./log/' + key + '/')) {
                fs.mkdirSync('./log/' + key + '/')
            }
        }
    }
    _checkDir()
    process.on('unhandledRejection', (reason) => {
        this.error('unhandledRejection', reason)
    })
    process.on('rejectionHandled', (promise) => {
        this.warn('rejectionHandled', promise)
    })
    process.on('uncaughtException', (e) => {
        this.error('uncaughtException', e)
    })
    process.on('warning', (warning) => {
        if (!warning || warning.name != 'DeprecationWarning') {
            this.warn('rejectionHandled', warning)
        }
    })
})()