
const global = {
	save() {
		uni.setStorageSync('globalData', this);
	},
	aly: {
		accessToken: '',
		refreshToken: '',
		
	},
  setting: {
    eimgPassword: '', // 加密图片密钥
  },
	num: {
    imgPerPage: 10, // 图片视图每页显示数量
  },
  key: {
    eimgSubfix: 'eimg', // 加密图片后缀
  }
};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	let _lifeData = uni.getStorageSync('globalData');
	console.log('getStorageSynclifeData')
	console.log(_lifeData)
	Object.assign(global, _lifeData);
} catch (e) {

}

function addSetters(obj) {
  for (let key in obj) {
    let value = obj[key];

    // 如果值是嵌套对象，递归处理
    if (typeof value === 'object' && value !== null) {
      addSetters(value);
    } else {
      Object.defineProperty(obj, key, {
        get: function() {
          return value;
        },
        set: function(newValue) {
          value = newValue;
          console.log(`设置属性: "${key}" 的值为: "${newValue}"`);
		  uni.setStorageSync('globalData', global);
        }
      });
    }
  }
}
// addSetters(global);

export default global