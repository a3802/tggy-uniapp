<template>
	<view  class="container">
		<web-view :src="url" @message="handleMessage"></web-view>
	</view>
	
</template>

<script>
export default {
	  data() {
		return {
		//h5支付字符串
		  pay_str: '',
		  //运行平台,
		  platform: '',
		  container: '',
		  url: "http://tgqy.yueyueyouqian.cn/shop.html",
		}
	  },
  
	 created(){
		 //#ifdef APP-PLUS 
		 this.url = this.url +'?pay_str='+this.pay_str;
		 // #endif
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
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
	  console.log('iiii');
    // 记录商品ID
    this.pay_str = uni.getStorageSync('alipay_str')
	console.log(this.pay_str);
  }
  
  
  
}
</script>

<style lang="scss" scoped>
  .container {
    // 设置ios刘海屏底部横线安全区域
    padding-bottom: constant(env(safe-area-inset-bottom) + 106rpx + 6rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 106rpx + 6rpx);
  }
</style>
