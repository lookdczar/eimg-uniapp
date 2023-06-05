import cache from '@/src/manager/cache.js'
import global from '@/src/manager/global.js'
import ImageManager from '@/src/manager/ImageManager.js'

const AlypService = {
    async loadMoreFileData(nextPage = false, fileModel = null) {
        let _fileModel = fileModel
        if(!_fileModel){
            _fileModel = cache.curFile
        }
        if (_fileModel.children.length > 0 && nextPage && !_fileModel.next_marker) {
            return _fileModel;
        }
        let response = await cache.alypManager.fetch_open_file_list({
            parent_file_id: _fileModel.file_id,
            next_marker: nextPage ? _fileModel.next_marker : null
        })
        
        _fileModel.next_marker = response.next_marker
        _fileModel.addChildrenfromDictList(response.items, global.key.eimgSubfix, function(fileModel) {
            if(fileModel.type == 'folder' && fileModel.name.startsWith(global.key.eimgSubfix+'_')) {
                // 将fileModel.name用_分割
                let nameArr = fileModel.name.split('_');
                // 将nameArr第2位到最后一位用_合并为字符串
                let base64name = nameArr.slice(2).join('_');
                let realName = Util.xorDecrypt(base64name, global.setting.eimgPassword)
                fileModel.name = realName
            }
        })

        return _fileModel;
    },
    async loadMoreImgData(num, page = 0, fileModel = null){
        console.log('loadMoreImgData')
        let _fileModel = fileModel
        if(!_fileModel){
            _fileModel = cache.curFile
        }
        let eimgList = _fileModel.getFilterTypeChildren(global.key.eimgSubfix);
        if(page * num >= eimgList.length) {
            return []
        }
        let data = []
        let max = Math.min((page + 1) * num, eimgList.length)
        for(let i = page * num; i < max; i++){
            let eimgFile = eimgList[i];
            if(!eimgFile.url) {
                console.error('eimgFile.url is null, fileName: ' + eimgFile.name);
                data.push({
                    'src': '',
                    'name': eimgFile.name,
                    'loaded': false,
                })
            }
            else {
                let blobUrl = await ImageManager.xor_decrypt(eimgFile.name, eimgFile.url, global.setting.eimgPassword);
                data.push({
                    'src': blobUrl,
                    'name': eimgFile.name,
                    'loaded': false,
                })
            }
        }
        return data
    }
}

export default AlypService