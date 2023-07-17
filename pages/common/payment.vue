<template>
	<view  class="container">
		<web-view :src="url"></web-view>
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
  
	mounted() {
		  // #ifdef APP-PLUS 
		  // var w = plus.webview.create(this.url + '?pay_str='+this.pay_str);
		  // w.show();
		  // setTimeout(() => {
				// plus.webview.close(w);
			 //  }, 1000)
		  // #endif
		  
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
 //    // 加载页面数据
	// this.platform = this.$u.os();
	// console.log(this.platform);
	// if(this.platform === 'android'){
	// 	console.log(222)
	// 	uni.createSelectorQuery().select('.container').innerHTML = this.pay_str;
	// 	// this.container = this.pay_str;
		
	// } 	
  },
  
  onReady(){
	//  console.log(2112122)
	//  console.log(this.platform);
	//  // let query = uni.createSelectorQuery().select('#alipay_submit');
	//  // console.log(query);
	//  // document.forms[0].submit()
	// if(this.platform === 'android'){

	// // 	console.log(222)
	// 	// uni.createSelectorQuery().select('.container').innerHTML = this.pay_str;
	// // 	this.container = this.pay_str;
		
	// // 	// console.log(cont);
	// // 	uni.createSelectorQuery().select('#alipay_submit').submit();
	// } 
	// document.querySelector('.container').innerHTML = this.pay_str;
	// document.forms[0].submit()
	
	// this.navToMyOrder()
	  
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
