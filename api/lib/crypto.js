var crypto = require('crypto')
const letters = 'abcdefghijklmnopqrstuvwxyz'
const CodeBook = require('./en.json')
module.exports = {
    md5: function (content) {
        var md5 = crypto.createHash('md5')
        md5.update(content)
        return md5.digest('hex')
    },
    aesEncrypt: function (data, secretKey) {
        try {
            var cipher = crypto.createCipher('aes-128-ecb', secretKey)
            return cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
        } catch (e) {
            return ''
        }
    },
    aesDecrypt: function (data, secretKey) {
        try {
            var decipher = crypto.createDecipher('aes-128-ecb', secretKey)
            return decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')
        } catch (e) {
            return ''
        }
    },
    enLetters: (arg) => {
        const combined = arg.join('')
        const prefix = letters[Math.floor(Math.random() * letters.length)]
        return prefix + CodeBook[prefix].map(i =>
            combined[i]
        ).join('')
    },
    deLetters: (token) => {
        const prefix = token[0]
        const chars = []
        token = token.substring(1)
        CodeBook[prefix].forEach((i, index) => chars[i] = token[index])
        const combined = chars.join('')
        return combined.match(/.{10}/g)
    }
}