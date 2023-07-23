<template>
		<view class="container">
			<view class="logo">
				<image  src="/static/icon.png" 
				style="			
				width: 120px;
				height: 120px;
				margin: 80px auto 20px auto;
				display: block;"></image>
			</view>
			<view class="title">
				口袋折扣
			</view>
			<view class="content">
				<h4>口袋折扣,是一款全电商平台优惠卷APP.</h4>
				<p>口袋折扣,购物返利,优惠卷发放,生活优惠于一体的APP,与国内主流商家平台,线下消费卖场合作</p>
				<p>覆盖近万家线下门店,涵盖购物,旅行,外卖,电影票务,加油,学习,用车等消费场景</p>
				<p>上线之后,提倡"尊享优质生活",帮助大家享受美好生活</p>
			</view>
			<view class="my-logout" style="margin-top: 120px;color: #cbc6c6;">Copyright@2023 口袋折扣 版权所有</view>
		</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	
	.log{
		width:100%;
		
	}
	.title {
		    width: 100%;
		    text-align: center;
	}
	
	.content {
		padding: 20px;
		
		h4 {
			margin: 10px 0;
		}
		p {
			line-height:30px
		}
	}
	
  // 退出登录
  .my-logout {
    display: flex;
    justify-content: center;
    margin-top: 50rpx;

    .logout-btn {
      width: 60%;
      margin: 0 auto;
      font-size: 28rpx;
      color: #616161;
      border-radius: 20rpx;
      border: 1px solid #dcdcdc;
      padding: 16rpx 0;
      text-align: center;
    }
  }	
</style>