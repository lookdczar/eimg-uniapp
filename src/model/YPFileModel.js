class YPFileModel {
	constructor({
		file_id = '',
		parent_file_id = '',
		name = '',
		url = '',
		size = 0,
		file_extension = '',
		content_hash = '',
		type = '',
		created_at = '',
		updated_at = '',
		parent = null,
		children = []
	}){
		/**
		 * @description 设备id
		 * @type {string} file_id
		 */
		this.file_id = file_id
		this.parent_file_id = parent_file_id
		this.name = name
		this.url = url ? url : ''
		this.size = size
		this.file_extension = file_extension
		this.content_hash = content_hash
		this.type = type
		this.created_at = created_at
		this.updated_at = updated_at
		/**
		 * @type {YPFileModel}
		 */
		this.parent = parent
		/**
		 * @type {YPFileModel[]}
		 */
		this.children = children
		if(!this.children) {
			this.children = []
		}
		this.filterTypeChildren = {}
		
		this.next_marker = ''
	}
    
	/**
	 * 
	 * @param {Array} children [{file_id, parent_file_id, name, size, file_extension, content_hash, type, created_at, updated_at}]
	 * @param {string} filterType 将指定文件后缀类型筛选出来，供后续使用
	 */
	addChildrenfromDictList(children, filterType){
		if(filterType && !this.filterTypeChildren.hasOwnProperty(filterType)){
			this.filterTypeChildren[filterType] = []
		}

		if(children instanceof Array){
			for(let child of children){
				let cModel = new YPFileModel({
					...child,
					parent: this
				});
				this.children.push(cModel)
				if(filterType && cModel.name.endsWith(filterType)){
					this.filterTypeChildren[filterType].push(cModel)
				}
			}
		}
	}
	/**
	 * 获取指定文件名后缀的子文件列表
	 * @param {string} filterType 
	 * @returns 
	 */
	getFilterTypeChildren(filterType){
		if(!this.filterTypeChildren.hasOwnProperty(filterType)){
			return []
		}
		return this.filterTypeChildren[filterType]
	}
}

export default YPFileModel