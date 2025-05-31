import CryptoJS from "crypto-js";

export const aes = (pwd: string) => {
    const key = CryptoJS.enc.Base64.parse(window.btoa("0123456789ABCDEF"));
    const plainText = CryptoJS.enc.Base64.parse(window.btoa(pwd));

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    // 这里的encrypted不是字符串，而是一个CipherParams对象
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};
