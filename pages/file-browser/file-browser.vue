<template>
	<view>
		<u-picker :show="showViewModePicker" ref="uPicker" :columns="viewMode" @confirm="viewModeConfirm" @cancel="showViewModePicker=false" :defaultIndex="viewModeDefaultIndex"></u-picker>
		<uni-list>
			<uni-list-item v-for="(item, index) in curFile.children" :key="index" :title="item.name" 
			clickable @click="onFileRowClick($event, index)"
			:link="item.type == 'folder' ? 'reLaunch' : null">
			</uni-list-item>
			<uni-list-item v-if="loadingData" key="loadingData">
				<template v-slot:body >
					<u-loading-icon text="加载中" textSize="18"></u-loading-icon>
					</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import * as cache from '@/src/manager/cache.js'
	export default {
		async onLoad() {
			console.log('onLoad')
		},
		async created() {

			if (!cache.curFile.children || cache.curFile.children.length == 0) {
				await this.loadMore()
			}
		},
		onNavigationBarButtonTap(btn) {  
		    if(btn.text == '返回') {
				if(cache.curFile.parent) {
					cache.curFile = cache.curFile.parent;
					this.curFile = cache.curFile;
				}
			} 
			else if(btn.text = '模式') {
				this.showViewModePicker = true;
			}
		} ,
		computed: {
			fileList() {
				return cache.curFile.children
			}
		},
		data() {
			return {
				curFile: cache.curFile,
				loadingData: false,
				showViewModePicker: false, // 是否选择显示模式框
				viewMode: [['列表','图片']],
				viewModeDefaultIndex: [0]
			}
		},
		methods: {
			onReachBottom() {
				// 页面触底时执行
				console.log("下拉到底");
				this.loadMore(true);
			},
			async onFileRowClick(e, index) {
				console.log('click: ' + index)
				let file = cache.curFile.children[index];
				if(file.type == 'file') {
					return;
				}
				cache.curFile = file;
				this.curFile = cache.curFile;
				if (!cache.curFile.children || cache.curFile.children.length == 0) {
					await this.loadMore(false)
				}
			},
			async loadMore(nextPage = false) {
				if (nextPage && !cache.curFile.next_marker) {
					return;
				}
				this.loadingData = true;
				const response = await cache.alypManager.fetch_open_file_list({
					parent_file_id: cache.curFile.file_id,
					next_marker: nextPage ? cache.curFile.next_marker : null
				})
				cache.curFile.next_marker = response.next_marker
				cache.curFile.addChildrenfromDictList(response.items)
				
				this.loadingData = false;
			},
			viewModeConfirm(e) {
				this.showViewModePicker = false;
				console.log(e)
			}

		}
	}
</script>

<style>

</style>