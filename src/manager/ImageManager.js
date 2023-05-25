
import md5 from 'js-md5';

const imageCache = new Map();
const cacheLimit = 500; 

const ImageManager = {
// 图片解密
	async xor_decrypt(fileName, encrypted_url, password) {
	// 检查缓存
	if (imageCache.has(encrypted_url)) {
		return imageCache.get(encrypted_url);
	}

	// 下载并解密图片
	const response = await fetch(encrypted_url, {
		method: "GET",
		referrer: '',
	});
	const encrypted_data = new Uint8Array(await response.arrayBuffer());
	const password_bytes = new TextEncoder().encode(password);
	const password_length = password_bytes.length;

	for (let i = 0; i < encrypted_data.length; i++) {
		encrypted_data[i] ^= password_bytes[i % password_length];
	}

	// 转换数据并添加到缓存
	const blob = new Blob([encrypted_data], { type: "image/png" });
	const image_url = URL.createObjectURL(blob);

	// 添加到缓存
	if (imageCache.size >= cacheLimit) {
		const firstKey = imageCache.keys().next().value;
		let url = imageCache.get(firstKey);
		imageCache.delete(firstKey);
		URL.revokeObjectURL(url);
	}
	imageCache.set(encrypted_url, image_url);

	return image_url;
	},
	onImageLoaded(e, aid, pid) {
		var t
		t = document.createElement('canvas')
		// null == e.nextElementSibling
		// 	? ((t = document.createElement('canvas')), e.after(t))
		// 	: (t = document.getElementById(e.id).nextElementSibling)
		t.classList.add('img-canvas-style');

		var a = t.getContext('2d'),
			n = e.width,
			d = e.naturalWidth,
			i = e.naturalHeight
			; (t.width = d),
				(t.height = i),
				// (n > e.parentNode.offsetWidth || 0 == n) && (n = e.parentNode.offsetWidth),
				(t.style.width = n + 'px'),
				(t.style.display = 'block')

		var o = pid
		var s = this.get_num(window.btoa(aid), window.btoa(o))
		for (
			var l = parseInt(i % s),
			r = d,
			m = 0;
			m < s;
			m++
		) {
			var c = Math.floor(i / s),
				g = c * m,
				w = i - c * (m + 1) - l
			0 == m ? (c += l) : (g += l), a.drawImage(e, 0, w, r, c, 0, g, r, c)
		}
		return t
	},

	get_num(e, t) {
		var a = 10,
			n = (e = window.atob(e)) + (t = window.atob(t))
		switch (
		((n = (n = (n = md5(n)).substr(-1)).charCodeAt()),
			e >= window.atob('MjY4ODUw') && e <= window.atob('NDIxOTI1')
				? (n %= 10)
				: e >= window.atob('NDIxOTI2') && (n %= 8),
			n)
		) {
			case 0:
				a = 2
				break
			case 1:
				a = 4
				break
			case 2:
				a = 6
				break
			case 3:
				a = 8
				break
			case 4:
				a = 10
				break
			case 5:
				a = 12
				break
			case 6:
				a = 14
				break
			case 7:
				a = 16
				break
			case 8:
				a = 18
				break
			case 9:
				a = 20
		}
		return a
	}
}
export default ImageManager