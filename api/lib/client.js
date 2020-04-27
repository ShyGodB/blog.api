const rules = {
    '微信': 'micromessenger',
    '今日头条': 'newsarticle',
    'UC浏览器': 'ucbrowser|ucweb|rv:1.2.3.4|uc',
    '手机QQ': 'qq',
    '微博': 'weibo'
}

const userAgentParse = function (userAgent) {
    userAgent = userAgent.toLowerCase()
    const device = {
        systemType: 'other',
        systemVersion: '',
        browserName: '',
        browserType: '',
        browserVersion: '',
        deviceModel: '',
        netType: ''
    }
    if (/android/i.test(userAgent)) {
        device.systemType = 'android'
        device.systemVersion = userAgent.match(/android ([\d.]+)/)
        device.systemVer = (device.systemVersion && device.systemVersion[1]) + ''
    }
    if (/(iphone|ipad|ipod|ios)/i.test(userAgent)) {
        device.systemType = 'ios'
        device.systemVersion = userAgent.match(/os ([\d_]+) like/)
        device.systemVersion = ((device.systemVersion && device.systemVersion[1]) + '').replace(/_/g, '.')
    }
    for (var key in rules) {
        if (new RegExp(rules[key], 'i').test(userAgent)) {
            device.browserType = rules[key]
            device.browserName = key
            device.browserVersion = userAgent.match(new RegExp(rules[key] + "\\/([\\d.]+)( |\\()"))
            device.browserVersion = (device.browserVersion && device.browserVersion[1]) + ''
            break
        }
    }
    let md = userAgent.match(/;\s?([^;]+?)\s?(build)?\//)
    let model = md && md[1] || ''

    model = /(iphone|ipad|ipod|ios)/i.test(userAgent) && ((userAgent.match(/\((.*)like mac/) || [])[1] || '').replace(/cpu iphone os|cpu os/, '') || model
    device.deviceModel = model
    let netType = userAgent.match(/nettype\/\w+/)
    netType = netType && netType[0].replace('nettype/', '') || ''
    if (netType.indexOf('wif') > -1) {
        netType = 'wifi'
    } else {
        switch (netType) {
        case '3g':
        case '3gnet':
        case '3gwap':
            netType = '3g'
            break
        case '4g':
        case 'ctlte':
        case 'ctnet':
        case 'ctc':
        case '4gnet':
            netType = '4g'
            break
        case 'cmnet':
        case 'cmwap':
        case 'ct_w_a_p':
        case 'ctwap':
        case '2g':
            netType = '2g'
            break
        default:
            netType += '未知：' + netType
            break
        }
    }
    device.netType = netType
    return device
}

module.exports = function (userAgent) {
    let device = Object.assign({
        systemType: 'other',
        systemVersion: '',
        browserName: '',
        browserType: '',
        browserVersion: '',
        deviceModel: '',
        netType: '',
    },userAgentParse(userAgent))
    return device
}

