<template>
	<view class="content">
		<view style="margin-top: var(--status-bar-height); width: 100%; height: calc(90vh - var(--status-bar-height));">
			<vue-waterfall-easy @click="onImgClick" :imgsArr="imgsArr" @scrollReachBottom="getData"></vue-waterfall-easy>
		</view>


	</view>
</template>

<script>
import YPFileModel from '@/src/model/YPFileModel.js'
// import * as global from '@/src/manager/global.js'
import * as cache from '@/src/manager/cache.js'
	export default {
		created() {
			console.log('index, created')
		},
		computed: {
			/**
			 * @type {YPFileModel}
			 */
			curFile() {
				return this.g_curFile
			},
			g_alypManager() {
				return this.$store.state.g_alypManager
			}
		},
		data() {
			return {
				imgsArr: [],
				group: 0,
			}
		},
		onLoad() {
			console.log('index, onload')
			this.getData()
		},
		methods: {
			modifyVuex() {
				
				this.$u.vuex('vuex_version', '1.0.1');
				// 修改对象的形式，中间用"."分隔
				this.$u.vuex('vuex_user.name', '诗圣');
			},
			onImgClick({e,  index, value }) {
      // 阻止a标签跳转
      e.preventDefault()
      if (e.target.tagName.toLowerCase() == 'img') {
        console.log('img clicked', index, value)
      }
    },
			getData() {
				
				console.log('getData');
				let newData = [{
						'src': 'https://img1.baidu.com/it/u=28231220,1635955213&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img0.baidu.com/it/u=4118637287,4106560954&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1127',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img1.baidu.com/it/u=3844428005,3477953559&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img1.baidu.com/it/u=3844428005,3477953559&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img1.baidu.com/it/u=3844428005,3477953559&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
						'href': 'https://www.baidu.com'
					},
					{
						'src': 'https://img2.baidu.com/it/u=3334914535,1784551017&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
						'href': 'https://www.baidu.com'
					},
				];
				this.imgsArr = this.imgsArr.concat(newData)
			},
		}
	}
</script>

<style>
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	
	.scroll-Y {
			height: 300rpx;
			width: 300rpx;
			
		}
		.scroll-YY
		{
			height: 300rpx;
			width: 300rpx;
			overflow-y: auto;
		}
	
		.scroll-view_H {
			white-space: nowrap;
			width: 100%;
		}
	
		.scroll-view-item {
			height: 300rpx;
			line-height: 300rpx;
			text-align: center;
			font-size: 36rpx;
		}
		.uni-bg-red{
			background:#F76260; color:#FFF;
		}
		.uni-bg-green{
			background:#09BB07; color:#FFF;
		}
		.uni-bg-blue{
			background:#007AFF; color:#FFF;
		}
</style>