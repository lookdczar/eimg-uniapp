<template>
	<view>
		<view>
			<u--form labelPosition="top" labelAlign="right" :model="g_setting" ref="uForm">
				<u-form-item label="alyAccessToken" prop="" borderBottom ref="alyAccessToken">
					<u--input v-model="global.aly.accessToken" border="none"></u--input>
				</u-form-item>
				<u-form-item label="alyRefreshToken" prop="" borderBottom ref="alyRefreshToken">
					<u--input v-model="global.aly.refreshToken" border="none"></u--input>
				</u-form-item>
				<u-form-item label="imgPassword" prop="" borderBottom ref="imgPassword">
					<u--input v-model="global.setting.eimgPassword" border="none"></u--input>
				</u-form-item>
			</u-form-item>
				<u-form-item label="图片加载张数" prop="" borderBottom ref="imgPerPage">
					<u--input v-model="global.num.imgPerPage" border="none"></u--input>
				</u-form-item>
				
			</u--form>
			<u-button type="primary" text="保存" customStyle="margin-top: 50px" @click="submit"></u-button>
		</view>
	</view>
</template>

<script>
import global from '@/src/manager/global.js'
	export default {
		created() {},
		mounted() {
			
		},
		onLoad() {
		},
		computed: {

		},
		data() {
			return {
				global: global

			}
		},
		methods: {
			submit() {
				global.num.imgPerPage = parseInt(global.num.imgPerPage, 10)
				console.log(global)
				global.save()
			}
		}
	}
</script>

<style>

</style>