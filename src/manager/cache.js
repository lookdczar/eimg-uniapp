import YPFileModel from '@/src/model/YPFileModel.js'
import AliyunPanManager from '@/src/manager/AliyunPanManager.js'

import global from '@/src/manager/global.js'

const cache = {
	/**
 * @description 当前文件
 * @type {YPFileModel} curFile
 */
	curFile: new YPFileModel({file_id: 'root'}),

	alypManager: new AliyunPanManager(
		{
			refresh_token:global.aly.refreshToken, 
			access_token: global.aly.accessToken,
			token_refresh_callback: (access_token, refresh_token) => {
				global.aly.accessToken = access_token
				global.aly.refreshToken = refresh_token
				global.save()

			}
		}
	),
	showTabBar: true
}


export default cache