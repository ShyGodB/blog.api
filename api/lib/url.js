const querystring = require('querystring')

module.exports = {
    params: function (url) {
        return querystring.parse(url.split('?')[1] || url.split('?')[0])
    },
    addParam: function (url, name, value) {
        const param = this.params(url)
        param[name] = value
        url = url.split('?')[0]
        return url + '?' + querystring.stringify(param)
    },
    firsDomain: function (referer) {
        if (referer.indexOf('://') > -1) {
            referer = referer.split('://')[1]
        }
        referer = referer.split('/')[0]
        let arr = referer.split('.')
        referer = arr[arr.length - 2] + '.' + arr[arr.length - 1]
        if (/(com.cn|net.cn|org.cn|gov.cn|.com.hk)$/.test(referer)) {
            referer = (arr[arr.length - 3] ? arr[arr.length - 3] + '.' : '') + referer
        }
        return referer
    }
}