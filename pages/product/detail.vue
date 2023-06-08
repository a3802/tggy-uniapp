<template>
  <view v-show="!isLoading" class="container">
    
		
	<!-- 权益商品详情页面 -->	
    <view class="header">
      <!-- 权益商品 -->
		<view class="order-status">
			<view class="status-icon">
			  <!-- 商品图标-->
				<image class="image" :src="product.product_image" mode="aspectFit"></image>
			</view>
			<view class="status-text">
			  <text>{{ product.short_name }}</text>
			</view>
		</view>
    </view>
	
    <!-- 充值：手机号 -->
    <view class="delivery-address i-card">
		<text class="iconfont icon-help"></text>
		<text class="text-help">他请确保账号无误，充值成功后不支持退换</text>
		<view class="form-item">
			<input class="form-item--input" type="number" v-model="mobile" maxlength="11" placeholder="请输入手机号码" />
		</view>
    </view>
	
    <!-- 优惠卷信息 -->
    <view class="service-simple" @click="handlePopup">
		<view class="s-list">
			<view class="s-item">
				<text class="item-val">优惠卷</text>
			</view>
		</view>
		<!-- 扩展箭头 -->
		<view class="s-arrow f-26 col-9 t-r">
			<text class="iconfont icon-arrow-right"></text>
		</view>
    </view>
	
	<!-- 权益产品选项 -->
	<view class="product-info">
		<!-- 权益产品大分类 -->
		<view class="product-master">
			<text class="product-master-name">会员</text>
		</view>
		<!-- 权益产品介绍标题 -->
		<view class="product-title">
			<text class="product-master-name">会员面额</text>
		</view>
		<!-- 权益产品详情 -->
		<view class="product-sub">
			<view class="sub-cate">
				<text>年卡</text>
			</view>
			<view class="discout-price">
				<text>$107.46</text>
			</view>
			<view class="market-price">
				<text>$200.46</text>
			</view>
		</view>		
	</view>
	
	
	
    <!-- 详情内容弹窗 -->
    <u-popup v-model="showPopup" mode="bottom" :closeable="true" :border-radius="26">
		<view class="service-content">
			<view class="title">优惠卷</view>
			<view class="status-icon">
			  <!-- 优惠卷-->
				<image class="image" src="" mode="aspectFit"></image>
			</view>
			<view class="title">暂无优惠卷</view>
		</view>
    </u-popup>

		

	</view>
</template>

<script>
import * as ProductApi from '@/api/product'
  // import Shortcut from '@/components/shortcut'
  // import Service from './components/Service'

  export default {
    components: {
      // Shortcut,
      // Service
    },
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 当前商品ID
        productIds: null,
        // 商品详情
        product: {},
		// 手机号
		mobile: '',
        // 购物车总数量
        // cartTotal: 0,
        // 显示详情内容弹窗
        showPopup: false,
        // 模式 1:都显示 2:只显示购物车 3:只显示立即购买
        // skuMode: 1
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 记录商品ID
	  console.log(options);
      this.productIds = parseInt(options.productIds)
	  
	  this.getProductDetail()
      // 加载页面数据
      this.onRefreshPage()
    },

    methods: {

      // 刷新页面数据
      onRefreshPage() {
        const app = this
        app.isLoading = true
        Promise.all([app.getProductDetail()])
          .finally(() => app.isLoading = false)
      },

      // 获取商品信息
      getProductDetail() {
        const app = this
        return new Promise((resolve, reject) => {
          ProductApi.detail(app.productIds)
            .then(result => {
              app.product = result.data.productInfo
              resolve(result)
            })
            .catch(reject)
        })
      },

      // 跳转到首页
      onTargetHome(e) {
        this.$navTo('pages/index/index')
      },
	  
	  // 显示弹窗
	  handlePopup() {
	    this.showPopup = !this.showPopup
	  }

    },

  }
</script>

<style>
  page {
    background: #fafafa;
  }
</style>
<style lang="scss" scoped>
  // @import "./detail.scss";
  .container {
    // 设置ios刘海屏底部横线安全区域
    padding-bottom: constant(env(safe-area-inset-bottom) + 106rpx + 6rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 106rpx + 6rpx);
  }
  // 页面顶部
  .header {
    display: flex;
    justify-content: space-between;
    background: repeating-linear-gradient(to right,#f1d696,#e8c269);
    height: 280rpx;
    padding: 70rpx 30rpx 0 30rpx;

    .order-status {
      display: flex;
      align-items: center;
      height: 128rpx;

      .status-icon {
        width: 128rpx;
        height: 128rpx;

        .image {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .status-text {
        padding-left: 20rpx;
        color: #fff;
        font-size: 54rpx;
        font-weight: bold;
      }
    }

		.next-action {
		  display: flex;
		  align-items: center;
		  height: 128rpx;

		  .action-btn {
			min-width: 152rpx;
			height: 56rpx;
			padding: 0 30rpx;
			line-height: 56rpx;
			background-color: #fff;
			text-align: center;
			border-radius: 28rpx;
			border-color: rgb(102, 102, 102);
			cursor: pointer;
			user-select: none;
			color: #c7a157;
		  }
		}
	}
  
  // 通栏卡片
  .i-card {
    background: #fff;
    padding: 24rpx 24rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    margin: 0 auto 20rpx auto;
    border-radius: 20rpx; 
	
	.iconfont {
		font-size:40rpx;
		position: relative;
		color:#e8c269;
		top:6rpx;
	}
	.text-help{
		font-size:28rpx;
		margin-left:20rpx;
		color:#e8c269;
		
	}
  }
  
  // 服务简述
.service-simple {
    padding: 24rpx 30rpx;
    display: flex;
    align-items: center;
	background: #fff;
	width: 94%;
	box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
	border-radius: 20rpx;
	margin: 0 auto 20rpx auto;

    .s-list {
      flex: 1;
      margin-left: -15rpx;
    }

    .s-item {
      float: left;
      font-size: 26rpx;
      margin: 8rpx 15rpx;

      .item-icon {
        color: #FA2209;
      }

      .item-val {
        margin-left: 12rpx;
		font-size:32rpx;
		font-weight: bold;
      }
    }
}

  // 服务详细内容
.service-content {
    padding: 24rpx;

    .title {
      font-size: 35rpx;
      margin-bottom: 50rpx;
      font-weight: bold;
      text-align: center;
    }

    .content-scroll {
      min-height: 400rpx;
      max-height: 760rpx;
    }

    .s-list {
      padding: 0 30rpx 0 80rpx;
    }

    .s-item {
      position: relative;
      margin-bottom: 60rpx;

      .item-icon {
        position: absolute;
        top: 6rpx;
        left: -50rpx;
        color: #FA2209;
      }

      .item-val {
        font-size: 28rpx;
      }

      .item-summary {
        font-size: 26rpx;
        margin-top: 20rpx;
        color: #6d6d6d;
      }
    }

}
  
 // 服务简述
.product-info {
    padding: 24rpx 30rpx;
    align-items: center;
 	background: #fff;
 	width: 94%;
 	box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
 	border-radius: 20rpx;
 	margin: 0 auto 20rpx auto;
 
	.product-master {
		border-radius: 20rpx;
	}
 
   .s-item {
     float: left;
     font-size: 26rpx;
     margin: 8rpx 15rpx;
 
     .item-icon {
       color: #FA2209;
     }
 
     .item-val {
       margin-left: 12rpx;
 		font-size:32rpx;
 		font-weight: bold;
     }
   }
} 
  
  
  // 收货地址
  .delivery-address {
    margin-top: -50rpx;

    .link-man {
      line-height: 46rpx;
      color: #333;

      .name {
        margin-right: 10rpx;
      }
    }

    .address {
      margin-top: 12rpx;
      color: #999;
      font-size: 24rpx;

      .detail {
        margin-left: 6rpx;
      }
    }

  }  
  // 输入框元素
  .form-item {
    display: flex;
    padding: 30rpx 28rpx;
    // border-bottom: 1rpx solid #f3f1f2;
    margin-bottom: 30rpx;
    height: 96rpx;

    &--input {
      font-size: 44rpx;
      letter-spacing: 1rpx;
      flex: 1;
      height: 100%;
    }

    &--parts {
      min-width: 100rpx;
      height: 100%;
    }

  }
</style>
