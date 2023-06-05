<template>
	<view>
		
		<view>
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
	import AlypService from '@/src/service/AlypService.js'

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
		async onLoad(option) {
			console.log('iamge-view-onLoad:' + option.index)
			console.log(cache.curFile.children[option.index])
			console.log(this)
			this.curFile = cache.curFile.children[option.index]
			await this.loadMoreData()
		},
		async created() {

		},
		onNavigationBarButtonTap(btn) {
			if (btn.text == '返回') {

				uni.navigateBack({
				});
			}
		},
		computed: {
			fileList() {
				return cache.curFile.children
			}
		},
		data() {
			return {
				loadingData: false,
				uiContentHeight: '',
				curFile: null	,
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
				await this.loadMoreData();
			},

			async loadMoreData(){
				this.loadingData = true;
				let res = await this.loadMoreImgData();
				console.log(res)
				if(res == false){
					await this.loadMoreFileData(true);
					await this.loadMoreImgData();
				}
				this.loadingData = false;
			},
			async loadMoreFileData(nextPage = false) {
				try {
					let file = await AlypService.loadMoreFileData(nextPage, this.curFile)
					this.curFile = file
				} catch (error) {
					console.error(error)
					uni.showToast({
						title: '文件请求异常: ' + error,
						icon: 'error'
					});
					
				}
				

			},
			async loadMoreImgData(){
				try {
					let moreImgData = await AlypService.loadMoreImgData(global.num.imgPerPage, this.imgViewPage, this.curFile)
					if(moreImgData.length > 0){
						this.imgViewData = this.imgViewData.concat(moreImgData);
						this.imgViewPage++;
						return true;
					}
					return false;
					
				} catch (error) {
					console.error(error)
					uni.showToast({
						title: '文件请求异常: ' + error,
						icon: 'error'
					});
					return true;
				}
				return false;
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
			resetData(){

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