const dateFormat = function (date, fmt) {
    if (!date) return ''
    date = new Date(date)
    let ret
    const opt = {
        "y+": date.getFullYear().toString(),        // 年
        "Y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "D+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "h+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString(),         // 秒
        "s+": date.getSeconds().toString()          // 秒
    }
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt)
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt
}
const dateFormatNow = function (time) {
    var etime = new Date(time)
    var now = new Date()
    function name(h) {
        if (h < 6) return '凌晨'
        else if (h < 12) return '上午'
        else if (h < 20) return '下午'
        return '晚上'
    }
    function hName(h) {
        var ht = parseInt((now.getTime() - h.getTime()) / 1000)
        return ht < 60 ? ht + '秒以前' : parseInt(ht / 60) + '分钟以前'
    }
    var html
    if (now.getFullYear() !== etime.getFullYear()) {
        html = etime.getFullYear() + '-' + (etime.getMonth() + 1) + '-' + etime.getDate() + ' ' + etime.getHours()
    } else if (now.getTime() - etime.getTime() > 172800000) {
        html = (etime.getMonth() + 1) + '-' + etime.getDate() + ' ' + etime.getHours()
    } else if (now.getMonth() === etime.getMonth() && (now.getDate() - etime.getDate() === 1) || (now.getMonth() - etime.getMonth() === 1) && now.getDate() === 1) {
        html = '昨天 ' + name(etime.getHours()) + etime.getHours()
    } else if (now.getMonth() === etime.getMonth() && now.getDate() === etime.getDate()) {
        if (now.getTime() - etime.getTime() > 3600000) {
            html = '今天 ' + name(etime.getHours()) + etime.getHours()
        } else {
            return hName(etime)
        }

    } else {
        html = (etime.getMonth() + 1) + '-' + etime.getDate() + ' ' + name(etime.getHours()) + etime.getHours()
    }
    html += ':' + etime.getMinutes()
    return html
}

Date.prototype.format = function (args) {
    return dateFormat(this, args)
}
Date.prototype.toJSON = function () {
    return dateFormat(this, 'yyyy-MM-dd hh:mm:ss')
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '')
}
String.prototype.lTrim = function () {
    return this.replace(/(^\s*)/g, '')
}
String.prototype.rTrim = function () {
    return this.replace(/(\s*$)/g, '')
}
String.prototype.format = function (args) {
    var result = this
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == 'object') {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp('({' + key + '})', 'g')
                    result = result.replace(reg, args[key])
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg1 = new RegExp('({[' + i + ']})', 'g')
                    result = result.replace(reg1, arguments[i])
                }
            }
        }
    }
    return result
}
module.exports = {
    dateFormat,
    dateFormatNow
}