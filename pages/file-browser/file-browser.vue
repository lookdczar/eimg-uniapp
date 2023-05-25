<template>
	<view>
		<u-picker :show="showViewModePicker" ref="viewModePicker" 
		:columns="uiViewModePickerList" 
		@confirm="onViewModePickerChange" 
		@cancel="showViewModePicker=false" 
		:defaultIndex="[viewModePickerIndex]"></u-picker>
		<view v-if="viewModePickerIndex==FileViewMode.list">
		<uni-list>
			<uni-list-item v-for="(item, index) in curFile.children" :key="index" :title="item.name" clickable
				@click="onFileRowClick($event, index)" :link="item.type == 'folder' ? 'reLaunch' : null">
			</uni-list-item>
			<uni-list-item v-if="loadingData" key="loadingData">
				<template v-slot:body>
					<u-loading-icon text="加载中" textSize="18"></u-loading-icon>
				</template>
			</uni-list-item>
		</uni-list>
		</view>
		
		<view v-if="viewModePickerIndex==FileViewMode.img" class="" :style="'height:' + uiContentHeight">
			<vue-waterfall-easy :drawImgCanvas="true" @click="onImgViewClick" :imgsArr="imgViewData" @scrollReachBottom="getImgViewData" @imgLoaded="onImgLoaded"></vue-waterfall-easy>
		</view>
		
	</view>
</template>

<script>
	import cache from '@/src/manager/cache.js'
	import global from '@/src/manager/global.js'
	import ImageManager from '@/src/manager/ImageManager.js'
	var FileViewMode = {
		list:0,
		img: 1
	}
	
	export default {
		mounted() {
		    // 获取设备信息
		    const systemInfo = uni.getSystemInfoSync();
		    const windowHeight = systemInfo.windowHeight; // 窗口高度
		    const statusBarHeight = systemInfo.statusBarHeight; // 状态栏高度
		    const screenHeight = systemInfo.screenHeight; // 屏幕高度
		
		    // 假设您的tabbar和navigationBar的高度
		    const tabBarHeight = 50; // 这里可以根据实际tabbar的高度来填写
		    const navigationBarHeight = 44; // 这里可以根据实际navigationBar的高度来填写
		
		    // 计算内容区域的高度
		    const contentHeight = screenHeight - tabBarHeight - navigationBarHeight - statusBarHeight;
		
		    // 设置内容区域的高度
		    this.uiContentHeight = contentHeight + 'px';
		  },
		async onLoad() {
			console.log('onLoad')
		},
		async created() {

			if (!cache.curFile.children || cache.curFile.children.length == 0) {
				await this.loadMore()
			}
		},
		onNavigationBarButtonTap(btn) {
			if (btn.text == '返回') {
				if(this.viewModePickerIndex == FileViewMode.img){
					this.viewModePickerIndex = FileViewMode.list;
					this.imgViewData = [];
				}
				if (cache.curFile.parent) {
					this.$nextTick(() => {
						console.log('this.viewModePickerIndex: ' + this.viewModePickerIndex)
						cache.curFile = cache.curFile.parent;
						this.curFile = cache.curFile;
					})
				}
			} else if (btn.text = '模式') {
				this.showViewModePicker = true;
			}
		},
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
				uiViewModePickerList: [
					['列表', '图片']
				],
				viewModePickerIndex: 0,
				FileViewMode: FileViewMode,
				uiContentHeight: '',
				imgViewData: [],
				imgViewPage: 0,
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
				if (file.type == 'file') {
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
				let response;
				try {
					response = await cache.alypManager.fetch_open_file_list({
					parent_file_id: cache.curFile.file_id,
					next_marker: nextPage ? cache.curFile.next_marker : null
				})
				} catch (error) {
					console.error(error)
					uni.showToast({
						title: '文件请求异常: ' + error,
						icon: 'error'
					});
				}
				
				cache.curFile.next_marker = response.next_marker
				cache.curFile.addChildrenfromDictList(response.items, global.key.eimgSubfix)

				this.loadingData = false;
			},
			onViewModePickerChange(e) {
				this.showViewModePicker = false;
				console.log('onViewModePickerChange:');
				console.log(e)
				this.viewModePickerIndex = e.indexs[0];
				console.log(this.viewModePickerIndex)
				document.getElementsByClassName('uni-btn-icon')[2].innerText = e.value[0];
				if(this.viewModePickerIndex == FileViewMode.img && this.imgViewData.length == 0){
					this.getImgViewData();
				}
				
			},
			setViewMode(mode) {
				this.viewModePickerIndex = mode;
				this.$refs.viewModePicker.setIndexs([this.viewModePickerIndex]);
			},
			async getImgViewData(){
				console.log('getImgViewData')
				let eimgList = this.curFile.getFilterTypeChildren(global.key.eimgSubfix);
				for(let i = this.imgViewPage * global.num.imgPerPage; i < (this.imgViewPage + 1) * global.num.imgPerPage; i++){
					if(i >= eimgList.length){
						break;
					}
					let eimgFile = eimgList[i];
					if(!eimgFile.url) {
						console.error('eimgFile.url is null, fileName: ' + eimgFile.name);
						this.imgViewData.push({
							'src': ''
						})
					}
					else {
						let blobUrl = await ImageManager.xor_decrypt(eimgFile.name, eimgFile.url, global.setting.eimgPassword);
						this.imgViewData.push({
							'src': blobUrl
						})
					}
				}
			},
			onImgLoaded(index, img){
				let eimgList = this.curFile.getFilterTypeChildren(global.key.eimgSubfix);
				let eimgFile = eimgList[index];
				let fileName = eimgFile.name;
				let aid_pid = fileName.split('.')[0];
				let aid = parseInt(aid_pid.split('_')[0]);
				let pid = aid_pid.split('_')[1];
				let canvasE = ImageManager.onImageLoaded(img, aid, pid);
				this.imgViewData[index].drawImgCanvas = canvasE;
			},
			onImgViewClick(){
				
			}

		}
	}
</script>

<style>
.fullScreen {
    height: 100vh;
    /* 其他样式 */
  }
</style>