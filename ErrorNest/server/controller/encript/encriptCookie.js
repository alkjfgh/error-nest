const CryptoJS = require('crypto-js')

function encryptCookie(member) {
    return CryptoJS.AES.encrypt(member.id, member.str_id).toString()
}

function decryptCookie(member) {
    const bytes = CryptoJS.AES.decrypt(member.id, member.str_id)
    return bytes.toString(CryptoJS.enc.Utf8)
}

module.exports = {encryptCookie, decryptCookie}