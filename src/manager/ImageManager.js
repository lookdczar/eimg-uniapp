// 图片解密
async function xor_decrypt(fileName, encrypted_url, password) {
	const response = await fetch(encrypted_url, {
		method: "GET",
		referrer: ''
	});
	const encrypted_data = new Uint8Array(await response.arrayBuffer());

	const password_bytes = new TextEncoder().encode(password);
	const password_length = password_bytes.length;

	for (let i = 0; i < encrypted_data.length; i++) {
		encrypted_data[i] ^= password_bytes[i % password_length];
	}

	// 将解密后的数据转换为可用于img标签的格式
	const blob = new Blob([encrypted_data], { type: "image/png" });
	const image_url = URL.createObjectURL(blob);
	return image_url;
}

export {
	xor_decrypt
} 