<template>
  <view v-show="!isLoading" class="container">
    
		
	<!-- 权益商品详情页面 -->	
    <view class="header">
      <!-- 权益商品 -->
		<view class="order-status">
			<view class="status-icon">
			  <!-- 商品图标-->
				<image v-if="product.category" class="image" :src="product.category.image.preview_url" mode="aspectFit"></image>
			</view>
			<view class="status-text">
			  <text v-if="product.category">{{ product.category.name }}</text>
			</view>
		</view>
    </view>
	
    <!-- 充值：手机号 -->
	<view class="i-card">
		<u-form  :model="form">
			<text class="iconfont icon-help"></text>
			<text class="text-help">他请确保账号无误，充值成功后不支持退换</text>
			<u-form-item class="form-item" prop="phone">
				<u-input class="form-item--input" type="number" v-model="phone" maxlength="11" placeholder="请输入手机号码" />
			</u-form-item>
		</u-form>
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
		<view class="product-category">
			<view class="product-master" :class="{ active: selectedTab === item.category_id }" @click="handleSelectCate(item)" v-for="(item, index) in product.sub_cate" :key="index" >
				<text class="product-master-name">{{item.name}}</text>
			</view>
		</view>
		<!-- 权益产品介绍标题 -->
		<view class="product-title">
			<text class="product-master-name">会员面额</text>
		</view>
		<!-- 权益产品详情 -->
		<view class="product-detail">
			<view class="product-sub" 
			v-for="(item, index) in product.detail" 
			:key="index" 
			v-show="item.category_id==selectedTab" 
			:class="{ active: selectetProductTab === item.product_id }" 
			@click="handleSelectNav(item)" 
			:data-setr="item.product_id">
				<view class="sub-cate">
					<text>年卡</text>
				</view>
				<view class="discout-price">
					<text>¥{{item.purchase_price}}</text>
				</view>
				<view class="market-price">
					<text>¥{{item.face_value}}</text>
				</view>
			</view>
		</view>
	</view>
	
	<!-- 权益产品备注 -->
	<view class="product-note">
		<h3>温馨提示</h3>
		<view>
			<h4>使用说明:</h4>
			<p>1.本商品仅限填写号码充值，请确保充值账号填写无误;</p>
			<p>2.因虚拟商品特性，官方平台明确售出后不得退换，一经充值成功将不支持退换;</p>
			<p>3.如对订单有疑问，请联系客服;</p>
		</view>
		
	</view>

    <!-- 底部选项卡 -->
    <view class="footer-fixed">
      <view class="footer-container">
        <!-- 导航图标 -->
        <view class="foo-item-fast">
          <!-- 首页 -->
          <view class="fast-item fast-item--home" @click="onTargetHome">
            <view class="fast-icon">
              <text class="iconfont icon-shouye"></text>
            </view>
            <view class="fast-text">
              <text>首页</text>
            </view>
          </view>
          <!-- 客服 -->
          <view class="fast-item fast-item--cart" @click="onTargetCart">
            <view class="fast-icon">
              <text class="iconfont icon-gouwuche"></text>
            </view>
            <view class="fast-text">
              <text>客服</text>
            </view>
          </view>
        </view>
        <!-- 操作按钮 -->
        <view class="foo-item-btn">
          <view class="btn-wrapper">
            <view class="btn-item btn-item-main" :class="{ disabled }" @click="handleBuy()">
              <text>立即充值</text>
            </view>
          </view>
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
import * as Verify from '@/utils/verify'
  
  // 表单字段元素
  const form = {
    phone: '',
    productIds: '',
  }
    
  export default {
    components: {
      // Shortcut,
      // Service
    },
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 当前分类商品ID
        categoryId: null,
        // 商品详情
        product: {},
		// 手机号
		phone: '',
        // 显示详情内容弹窗
        showPopup: false,
		//上级分类项目
		selectedTab: 0,
		//商品选项卡
		selectetProductTab: 0,
		//表单提交
		form,
		//验证规则
		// rules,
        // 按钮禁用
        disabled: false		
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 记录商品ID
	  console.log(options);
      this.categoryId = parseInt(options.categoryId)
	  
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
	  
      // 表单提交
      handleBuy() {
        const app = this
        if (app.disabled) {
          return false
        }
		console.log(app.isLoading)
		if (!app.isLoading && app.validteData(app.phone)) {
		  app.submitBuy()
		}
		//表单验证
		
      },
	  
      // 验证手机号
      validteData(str) {
		console.log(str);
        if (Verify.isEmpty(str)) {
          this.$toast('请先输入手机号')
          return false
        }
        if (!Verify.isMobile(str)) {
          this.$toast('请输入正确格式的手机号')
          return false
        }
        return true
      },	  
	  
	  //提交数据
		submitBuy(){
			app.disabled = true;
			app.mode = 'TgYi';
			form.productId = app.selectetProductTab;
			form.mobile = app.phone;
			ProductApi.submit(app.mode, app.form).
			then(result => app.onSubmitCallback(result))
			.catch(err => {
				if (err.result) {
					const errData = err.result.data
					if (errData.is_created) {
						// app.navToMyOrder()
						return false
					}
				}
				app.disabled = false
			})
		},

		  // 订单提交成功后回调
		onSubmitCallback(result) {
			const app = this
			// 发起微信支付
			if (result.data.payType == PayTypeEnum.ALIPAY.value) {
				aliPayment(result.data.payment)
					.then(() => app.$success('支付成功'))
					.catch(err => app.$error('订单未支付'))
					.finally(() => {
					  app.disabled = false
					  app.navToMyOrder()
					})
			}
		},
	  
      // 获取商品信息
      getProductDetail() {
        const app = this
        return new Promise((resolve, reject) => {
          ProductApi.detail(app.categoryId)
            .then(result => {
				app.product = result.data.productInfo
				app.selectedTab = result.data.productInfo.sub_cate[0].category_id
				console.log(app.product)
				resolve(result)
				app.product.detail.some((item, index) => {
					if(item.category_id == app.selectedTab){
						this.selectetProductTab = item.product_id;
						return true;
					}
				})
				
            })
            .catch(reject)
        })
      },

      // 跳转到首页
      onTargetHome(e) {
        this.$navTo('pages/index/index')
      },
	  
	  //默认选项
	  handleSelectNav(data) {
		  
		  if(data.category_id == this.selectedTab){
			  console.log(data.product_id)
				this.selectetProductTab = data.product_id;
				return true;
			}
	  },
	  
	  //产品默认选项
	  handleSelectCate(data) {
		  console.log(this.selectedTab);
		  console.log(data);
		  if(data.category_id == this.selectedTab){
				this.selectetProductTab = data.product_id;
		  }else{
			  this.selectedTab = data.category_id;
			  console.log(this.selectedTab);
		  }
			this.product.detail.some((item, index) => {
				if(item.category_id == this.selectedTab){
					this.selectetProductTab = item.product_id;
					return true;
				}
			})					
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
    margin: -76rpx auto 20rpx auto;
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
	.u-border-bottom:after {
		border-bottom-width:0px
	}
	
	  // 输入框元素
	.form-item {
		display: flex;
		padding: 30rpx 28rpx;
		height: 96rpx;

		&--input {
		  letter-spacing: 1rpx;
		  flex: 1;
		  height: 100%;
		}
		
		&/deep/.u-input__input {
			font-size:24px;
		}
		
		&/deep/.u-form-item__message {
			display: none;
		}	
	}
	
		
}

.u-input__input {
	font-size:24px !important;
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
		font-size:30rpx;
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
		width: 160rpx;
		height: 80rpx;
		display: inline-flex;
		text-align: center;
		align-items: center;
		justify-content: space-evenly;
		border: solid 1rpx #ddd;
		border-radius: 20rpx;
		font-size: 29rpx;
		font-weight: bold;
		flex-wrap: wrap;
		margin:20rpx 40rpx 0 0;
	}
	.product-sub.active, .product-master.active {
		border: solid 0.1rpx red;
		color: red;
	}
	
	.product-title {
		font-size: 30rpx;
		margin:20rpx 0rpx;
		color: #a59b9b;
	}
	
	.product-sub {
		width: 160rpx;
		height: 240rpx;
		display: inline-grid;
		text-align: center;
		align-items: center;
		justify-content: space-evenly;
		border: solid 1rpx #ddd;
		border-radius: 20rpx;
		font-size: 32rpx;
		flex-wrap: wrap;
		margin: 0rpx 40rpx 0rpx 0rpx;
		padding: 24rpx;
		
		.sub-cate {
			font-size: 29rpx;
		}
		
		.discout-price {
			font-size: 32rpx;
			font-weight: bold;
		}
		
		.market-price {
			font-size: 24rpx;
			text-decoration: line-through;
			color: #a59b9b;
			
		}
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
  
// 权益商品提醒
.product-note {
    padding: 24rpx 30rpx;
    align-items: center;
 	background: #fff;
 	width: 94%;
 	box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
 	border-radius: 20rpx;
 	margin: 0 auto 20rpx auto;
	
	h3 {
		margin-bottom: 20rpx;
	}
	h4,p {
		color:#ddd;
		font-size: 22rpx;
	}
}

  
// 底部操作栏
.footer-fixed {
  position: fixed;
  bottom: var(--window-bottom);
  left: 0;
  right: 0;
  display: flex;
  z-index: 11;
  box-shadow: 0 -4rpx 40rpx 0 rgba(151, 151, 151, 0.24);
  background: #fff;

  // 设置ios刘海屏底部横线安全区域
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.footer-container {
  width: 100%;
  display: flex;
  height: 130rpx;
}

// 快捷菜单
.foo-item-fast {
  box-sizing: border-box;
  min-width: 214rpx;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 12rpx;

  .fast-item {
    position: relative;
    padding: 4rpx 0;
    line-height: 1;
    text-align: center;
    width: 84rpx;

    &--cart {
      margin-left: 6rpx;
      .fast-icon { margin-left: -12rpx; }
    }
    
    // 角标
    .fast-badge {
      display: inline-block;
      box-sizing: border-box;
      min-width: 16px;
      padding: 0 3px;
      color: #fff;
      font-weight: 500;
      font-size: 12px;
      font-family: -apple-system-font, Helvetica Neue, Arial, sans-serif;
      line-height: 1.2;
      text-align: center;
      background-color: #ee0a24;
      border: 1px solid #fff;
      border-radius: 999px;
    }

    .fast-badge--fixed {
      position: absolute;
      top: 0;
      right: 0;
      transform-origin: 100%
    }

    .fast-icon {
      font-size: 44rpx;
      margin-bottom: 8rpx;
    }

    .fast-text {
      font-size: 22rpx;
    }
  }
}

// 操作按钮
.foo-item-btn {
  flex: 1;

  .btn-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .btn-item {
    flex: 1;
    font-size: 35rpx;
    height: 90rpx;
    margin-right: 16rpx;
    color: #fff;
    border-radius: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // 立即购买按钮
  .btn-item-main {
    background: linear-gradient(to right, #f9211c, #ff6335);
	// 禁用按钮
	&.disabled {
	  opacity: 0.6;
	}
  }
  
}  
</style>
