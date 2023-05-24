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
					<u--input v-model="global.aly.imgPassword" border="none"></u--input>
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
				console.log(global)
				global.save()
			}
		}
	}
</script>

<style>

</style>