class YPFileModel {
	constructor({
		file_id = '',
		parent_file_id = '',
		name = '',
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
		
		this.next_marker = ''
	}

	addChildrenfromDictList(children){
		if(children instanceof Array){
			for(let child of children){
				this.children.push(new YPFileModel({
					...child,
					parent: this
				}))
			}
		}
	}
}

export default YPFileModel