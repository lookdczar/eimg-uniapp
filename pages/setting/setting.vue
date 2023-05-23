<template>
	<view>
		<view>
			<u--form labelPosition="top" labelAlign="right" :model="g_setting" ref="uForm">
				<u-form-item label="alyAccessToken" prop="" borderBottom ref="alyAccessToken">
					<u--input v-model="g_setting.alyAccessToken" border="none"></u--input>
				</u-form-item>
				<u-form-item label="alyRefreshToken" prop="" borderBottom ref="alyRefreshToken">
					<u--input v-model="g_setting.alyRefreshToken" border="none"></u--input>
				</u-form-item>
				<u-form-item label="imgPassword" prop="" borderBottom ref="imgPassword">
					<u--input v-model="g_setting.imgPassword" border="none"></u--input>
				</u-form-item>
			</u--form>
			<u-button type="primary" text="保存" customStyle="margin-top: 50px" @click="submit"></u-button>
		</view>
	</view>
</template>

<script>
	export default {
		created() {},
		mounted() {
			console.log(this.g_setting)
		},
		onLoad() {

		},
		computed: {

		},
		data() {
			return {


			}
		},
		methods: {
			submit() {
				console.log(this.g_setting)
				this.$u.vuex('g_setting', this.g_setting);
			}
		}
	}
</script>

<style>

</style>