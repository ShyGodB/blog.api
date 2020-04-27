module.exports = {
    getNonce: function (length) {
        length = length || 32
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var pos = chars.length
        var nonces = []
        var i
        for (i = 0; i < length; i++) {
            nonces.push(chars.charAt(Math.floor(Math.random() * pos)))
        }
        return nonces.join('')
    },
    random: function (min, max) {
        var range = max - min
        var rand = Math.random()
        return (min + Math.round(rand * range))
    },
    guid: function () {
        function s4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        return (s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4())
    },
    distance: function (lat1, lng1, lat2, lng2) {
        function rad(d) {
            return d * Math.PI / 180.0
        }
        var radLat1 = rad(lat1)
        var radLat2 = rad(lat2)
        var a = radLat1 - radLat2
        var b = rad(lng1) - rad(lng2)

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
            + Math.cos(radLat1) * Math.cos(radLat2)
            * Math.pow(Math.sin(b / 2), 2)))
        s = s * 6378.137
        s = Math.round(s * 1000)
        return s
    },
}