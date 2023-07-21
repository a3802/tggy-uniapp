<template>
	<view  class="container">
		<web-view :src="url" @message="getMessage"></web-view>
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
  
  getMessage(e) {
     console.log('webView传递过来的消息')
     const action = e.detail.data[0].action
   },
  

		
	 created(){
		 this.url = this.url +'?pay_str='+this.pay_str;
	 },


  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
	  console.log('iiii');
    // 记录商品ID
    this.pay_str = uni.getStorageSync('alipay_str')
	console.log(this.pay_str);

  },
  
  onReady(){

	  
  },
  
  // 跳转到我的订单(等待1秒)
  navToMyOrder() {
    setTimeout(() => {
      this.$navTo('pages/order/index')
    }, 1000)
  },
  
}
</script>

<style lang="scss" scoped>
  .container {
    // 设置ios刘海屏底部横线安全区域
    padding-bottom: constant(env(safe-area-inset-bottom) + 106rpx + 6rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 106rpx + 6rpx);
  }
</style>
