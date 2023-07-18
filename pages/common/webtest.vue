<template>
	<view>
		<web-view :src="url" @message="handleMessage"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},

			
		created(){
			this.url = 'http://tgqy.yueyueyouqian.cn/shop.html'
		},
		methods: {
            // 触发方法
			handleMessage(data) {
				console.log(data)
				console.log(data.detail.data[0].data)
				console.log(data.detail.data[0]['data'])
				if (data.detail.data.data == 'h5页面传的值') {
					// 给url重新赋值
					this.url = ""
				} else if (data.detail.data[0].data == 'order') {
                    // 其他的跳转查看uniapp官网
					// setTimeout(() => {
					// 	uni.redirectTo({
					// 		url: '/pages/order/index'
					// 	});
					// }, 1000)
					this.navToMyOrder();
				}

			},
			// 跳转到我的订单(等待1秒)
			navToMyOrder() {
			  setTimeout(() => {
				this.$navTo('pages/order/index',{},'redirectTo')
			  }, 1000)
			},			
		},

	}
</script>

<style>


</style>
