<template>
	<view  class="container">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
export default {
	  data() {
		return {
		  url: "http://dizait.yueyueyouqian.cn/user_secret.html",
		}
	  }
	}
</script>

<style>
</style>