

import getRandomStr from './getRandomStr'
var CryptoJS = require("crypto-js")
const encryption = (mobile, openid) => {
    
    let key = CryptoJS.enc.Utf8.parse("Member01_Signup0"); // 加密秘钥
    let iv = CryptoJS.enc.Utf8.parse("1234567890123412");  //  矢量

    // 需要加密的字符串
    let endData = `${getRandomStr(5)}${mobile}${openid}${getRandomStr(5)}${Date.parse(new Date())}`
    console.log(endData)
    let encryptResult = CryptoJS.AES.encrypt(endData, key, {   //  AES加密
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,  // 后台用的是pad.Pkcs5,前台对应为Pkcs7
    })

    return encodeURIComponent(CryptoJS.enc.Base64.stringify(encryptResult.ciphertext))
}

export default encryption
