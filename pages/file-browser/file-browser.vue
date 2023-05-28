<template>
	<view>
		<u-picker :show="showViewModePicker" ref="viewModePicker" 
		:columns="uiViewModePickerList" 
		@confirm="onViewModePickerChange" 
		@cancel="showViewModePicker=false" 
		:defaultIndex="[uiFileViewMode]"></u-picker>
		<view v-if="uiFileViewMode==FileViewMode.list">
		<uni-list ref="uiListView" @scrolltolower="fileListReachBottom" :lowerThreshold="100">
			<uni-list-item v-for="(item, index) in curFile.children" :key="index" :title="item.name" clickable
				@click="onFileRowClick($event, index)" :link="item.type == 'folder' ? 'reLaunch' : null">
			</uni-list-item>
			<uni-list-item v-if="loadingData" key="loadingData">
				<template v-slot:body>
					<uni-load-more class="center-block" :status="loadingData?'loading':'no-more'"></uni-load-more>
				</template> 
			</uni-list-item>
		</uni-list>
		</view>

		<view v-if="uiFileViewMode==FileViewMode.img">
		<scroll-view ref="uiImgView" >
			<view v-for="(item, index) in imgViewData" :key="index" class="pb-1 center-block" :style="'max-width: 95%;width:auto;height:auto;'" :desc="item.name">
				<img :class="{'hidden':item.loaded}" :ref="'imgView-img-'+index" :src="item.src" @load="onImgLoaded($event, index)" :style="'width:100%;height:100%;'">
				<!-- <canvas :ref="'imgView-unicanvas-'+index"  :canvas-id="'imgView-canvas-'+index"></canvas> -->
			</view>
			<view >
				<uni-load-more class="center-block" :status="loadingData?'loading':'no-more'"></uni-load-more>
			</view>
		</scroll-view>
		</view>
		
		
		
	</view>
</template>

<script>
	import cache from '@/src/manager/cache.js'
	import global from '@/src/manager/global.js'
	import ImageManager from '@/src/manager/ImageManager.js'
	import Util from '@/src/manager/Util.js'
	var FileViewMode = {
		desc: ['列表', '图片'],
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
				await this.loadMoreData()
			}
		},
		onNavigationBarButtonTap(btn) {
			if (btn.text == '返回') {

				if (cache.curFile.parent) {
					this.$nextTick(() => {
						console.log('this.uiFileViewMode: ' + this.uiFileViewMode)
						if(this.uiFileViewMode == FileViewMode.img){
							this.setViewMode(FileViewMode.list)
						}
						this.resetData(cache.curFile.parent)
					})
				}
			} else if (btn.text == '模式') {
				// this.showViewModePicker = true; 
				if(this.uiFileViewMode == FileViewMode.list){
					this.setViewMode(FileViewMode.img)
				}else {
					this.setViewMode(FileViewMode.list)
				}
			} else if (btn.text == '全屏') {
				if(cache.showTabBar){
					uni.hideTabBar()
				}else {
					uni.showTabBar()
				}
				cache.showTabBar = !cache.showTabBar
			}
			else if (btn.text == '重绘') {
				this.uiImgReDraw = !this.uiImgReDraw
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
					FileViewMode.desc
				],
				uiFileViewMode: 0,
				FileViewMode: FileViewMode,
				uiContentHeight: '',
				imgViewData: [
					// {
					// 	'src': 'https://img1.baidu.com/it/u=28231220,1635955213&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img0.baidu.com/it/u=4118637287,4106560954&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1127',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img1.baidu.com/it/u=3844428005,3477953559&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img1.baidu.com/it/u=3844428005,3477953559&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img1.baidu.com/it/u=3844428005,3477953559&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
					// {
					// 	'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
					// 	'href': 'https://www.baidu.com'
					// },
				],
				imgViewPage: 0,
				uiImgReDraw: false, // 是否重绘图片
			}
		},
		methods: {
			onReachBottom(){
				this.fileListReachBottom()
			},
			async fileListReachBottom() {
				// 页面触底时执行
				console.log("下拉到底");
				await this.loadMoreData(true);
			},
			
			async onFileRowClick(e, index) { // 点击文件列表的行
				console.log('click: ' + index)
				let file = cache.curFile.children[index];
				if (file.type == 'file') {
					return;
				}
				this.resetData(file);
				if (!cache.curFile.children || cache.curFile.children.length == 0) {
					await this.loadMoreData(false)
				}
			},
			async loadMoreData(nextPage = false){
				this.loadingData = true;
				if(this.uiFileViewMode == FileViewMode.list){
					await this.loadMoreFileData(nextPage);
				}else if(this.uiFileViewMode == FileViewMode.img){
					let res = await this.loadMoreImgData();
					if(!res){
						await this.loadMoreFileData(true);
						await this.loadMoreImgData();
					}
				}
				this.loadingData = false;
			},
			async loadMoreFileData(nextPage = false) {
				if (nextPage && !cache.curFile.next_marker) {
					return;
				}
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
				cache.curFile.addChildrenfromDictList(response.items, global.key.eimgSubfix, function(fileModel) {
					if(fileModel.type == 'folder' && fileModel.name.startsWith(global.key.eimgSubfix+'_')) {
						// 将fileModel.name用_分割
						let nameArr = fileModel.name.split('_');
						// 将nameArr第2位到最后一位用_合并为字符串
						let base64name = nameArr.slice(2).join('_');
						let realName = Util.xorDecrypt(base64name, global.setting.eimgPassword)
						fileModel.name = realName
					}
				})

			},
			async loadMoreImgData(){
				console.log('loadMoreImgData')
				let eimgList = this.curFile.getFilterTypeChildren(global.key.eimgSubfix);
				if(this.imgViewData.length == eimgList.length) {
					return false
				}
				let max = Math.min((this.imgViewPage + 1) * global.num.imgPerPage, eimgList.length)
				for(let i = this.imgViewPage * global.num.imgPerPage; i < max; i++){
					let eimgFile = eimgList[i];
					if(!eimgFile.url) {
						console.error('eimgFile.url is null, fileName: ' + eimgFile.name);
						this.imgViewData.push({
							'src': '',
							'name': eimgFile.name,
							'loaded': false,
						})
					}
					else {
						let blobUrl = await ImageManager.xor_decrypt(eimgFile.name, eimgFile.url, global.setting.eimgPassword);
						this.imgViewData.push({
							'src': blobUrl,
							'name': eimgFile.name,
							'loaded': false,
						})
					}
				}
				this.imgViewPage++;
				return true
			},
			onViewModePickerChange(e) {
				this.showViewModePicker = false;
				console.log('onViewModePickerChange');
				this.setViewMode(e.indexs[0]);	
			},
			setViewMode(mode) { // 设置浏览模式
				this.uiFileViewMode = mode;
				document.getElementsByClassName('uni-btn-icon')[2].innerText = FileViewMode.desc[mode];
				this.$refs.viewModePicker.setIndexs([this.uiFileViewMode]);
				if(mode == FileViewMode.list){
					
				}
				else if(mode == FileViewMode.img){
					// 加载图片数据
					if(this.uiFileViewMode == FileViewMode.img && this.imgViewData.length == 0){
						this.loadMoreData();
					}
				}
			},
			onImgLoaded(e, index){
				if(!this.uiImgReDraw){
					return
				}
				let data = this.imgViewData[index];
				let url = data.src;
				let img = (this.$refs['imgView-img-'+index])[0];
				let canvas = document.createElement('canvas');
				img.after(canvas)
				// let canvasContext = uni.createCanvasContext('imgView-canvas-'+index)
				// let c = img.nextElementSibling.getElementsByTagName("canvas")[0]
				// let unicanvas = this.$refs['imgView-unicanvas-'+index][0]

				// return
				// let eimgList = this.curFile.getFilterTypeChildren(global.key.eimgSubfix);
				// let eimgFile = eimgList[index];
				let width = img.width;
				let height = img.height;
				if(data.loaded) {
					width = data.width;
					height = data.height;
				} else {
					data.width = width;
					data.height = height;
				}
				let fileName = data.name;
				let aid_pid = fileName.split('.')[0];
				let aid = parseInt(aid_pid.split('_')[0]);
				let pid = aid_pid.split('_')[1];
				let canvasE = ImageManager.onImageLoaded(img, width, height, aid, pid, canvas);
				data.loaded = true;
			},
			onImgViewClick(){
				
			},
			resetData(currentViewFile){
				if(currentViewFile){
					cache.curFile = currentViewFile;
					this.curFile = cache.curFile;
				}
				this.imgViewData = [];
				this.imgViewPage = 0;
			}

		}
	}
</script>

<style>
.fullScreen {
    height: 100vh;
    /* 其他样式 */
  }
  .hidden {
	display: none !important;
  }
</style>