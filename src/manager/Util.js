

const Util = {
    // 异或解密base64字符串
    xorDecrypt(base64Url, key) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const encryptedBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const keyBytes = new TextEncoder().encode(key);
        const decryptedBytes = new Uint8Array(encryptedBytes.length);

        for (let i = 0; i < encryptedBytes.length; i++) {
            decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
        }

        const decryptedText = new TextDecoder('utf-8').decode(decryptedBytes);
        return decryptedText;
    }
}

export default Util
