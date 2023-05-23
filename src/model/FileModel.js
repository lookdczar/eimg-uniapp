class YPFile {
	constructor(){
		this.file_id = ''
		this.parent_file_id = ''
		this.name = ''
		this.size = 0
		this.file_extension = ''
		this.content_hash = ''
		this.type = ''
		this.created_at = ''
		this.updated_at = ''
		/**
		 * @type {YPFile[]}
		 */
		this.children = []
	}
}

export default YPFile