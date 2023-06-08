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
        // 显示/隐藏SKU弹窗
        // showSkuPopup: false,
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
    padding: 56rpx 30rpx 0 30rpx;

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
        font-size: 38rpx;
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
    padding: 18rpx;
    border-bottom: 1rpx solid #f3f1f2;
    margin-bottom: 30rpx;
    height: 96rpx;

    &--input {
      font-size: 28rpx;
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
