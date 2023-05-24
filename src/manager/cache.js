import YPFileModel from '@/src/model/YPFileModel.js'
import AliyunPanManager from '@/src/manager/AliyunPanManager.js'

import global from '@/src/manager/global.js'

/**
 * @description 当前文件
 * @type {YPFileModel} curFile
 */
const curFile = new YPFileModel({file_id: 'root'})

const alypManager = new AliyunPanManager(
	{
		refresh_token:global.aly.refreshToken, 
		access_token: global.aly.accessToken,
		token_refresh_callback: (access_token, refresh_token) => {
			global.aly.accessToken = access_token
			global.aly.refreshToken = refresh_token
			global.save()

		}
	}
)

export {
	curFile,
	alypManager
}