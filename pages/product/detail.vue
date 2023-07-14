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
			<text class="text-help">请确保账号无误，充值成功后不支持退换</text>
			<u-form-item class="form-item" prop="phone">
				<u-input class="form-item--input" type="number" v-model="phone" maxlength="11" placeholder="请输入手机号码" />
			</u-form-item>
		</u-form>
	</view>
	
    <!-- 优惠卷信息 -->
    <view class="service-simple" @click="handlePopup()">
		<view class="s-list">
			<view class="s-item">
				<text class="item-val">优惠卷</text>
			</view>
		</view>
		<!-- 扩展箭头 -->
		<view class="s-arrow f-26 col-9 t-r">
          <view v-if="ArrvalueIn(list.data,selectetProductTab)">
            <text class="col-m">选择优惠券</text>
            <text class="right-arrow iconfont icon-arrow-right"></text>
          </view>
          <text v-else class="">无优惠券可用</text>
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
		<view class="product-title" v-if="categoryId != 10068">
			<text class="product-master-name">会员面额</text>
		</view>
		<view class="product-title-recharge" v-else>
			<text style="color:black; font-weight:bold; margin-right:10px;">选择充值金额</text>
			<text style="color:red; font-size:12px; font-weight: bold;">(注:虚拟号|副卡|空号|错号|携号转网|集团共用号|一机多号:请勿下单  无法售后)</text>
		</view>
		<!-- 权益产品详情 -->
		<view class="product-detail">
			<view class="product-sub" 
			v-for="(item, index) in product.detail" 
			:key="index" 
			v-show="item.category_id==selectedTab" 
			:class="[ selectetProductTab === item.product_id ? 'active' : '', 
					categoryId === 10068 ? 'recharge' : '']" 
			@click="handleSelectNav(item)" 
			:data-setr="item.product_id"
			>
				<view class="sub-cate">
					<text>{{item.short_name}}</text>
				</view>
				<view class="discout-price" v-if="categoryId != 10068">
					<text>¥{{item.purchase_price}}</text>
				</view>
				<view class="recharge-price" v-else>
					券后&nbsp;¥<text style="font-size:17px; font-weight:bold;">{{item.purchase_price}}</text>
				</view>
				<view class="market-price" v-if="categoryId != 10068">
					<text>¥{{item.face_value}}</text>
				</view>
			</view>
		</view>
	</view>
	
	<!-- 权益产品备注 -->
	<view class="product-note" v-if="categoryId != 10068">
		<h3>温馨提示</h3>
		<view>
			<h4>使用说明:</h4>
			<p>1.本商品仅限填写号码充值，请确保充值账号填写无误;</p>
			<p>2.因虚拟商品特性，官方平台明确售出后不得退换，一经充值成功将不支持退换;</p>
			<p>3.如对订单有疑问，请联系客服;</p>
		</view>
	</view>
	<view class="product-note" v-else>
		<h3>温馨提示</h3>
		<view>
			<h4>话费优惠券使用说明:</h4>
			<p>1.100元话费优惠券包含: 5元10张+10元5张;</p>
			<p>2.话费优惠券每月仅可使用5张,每张最低满100元减5元;</p>
			<p>3.下载"口袋折扣App",查收100元话费优惠券礼包;</p>
			<p>4.充值金额门槛:20元,50元,100元,200元,具体以话费充值页面为准;</p>
			<p>5.话费一般72h内到账,如遇特殊情况联系客服;</p>
			<p>6.因第三方充值波动,如果缺货请选择其他挡位充值;</p>
		</view>
	</view>
	
	<view class="product-note" v-if="categoryId === 10068">
		<h3>注意事项</h3>
		<view>
			<h4>单个号码每天最多充值400元、每月最多600元虚拟号、副卡、空号、错号、携号转网、集团共用余额号码请勿下单，无法售后</h4>
			<h4>[充值范围]:全国移动/联通/电信号码</h4>
			<h4>[充值方式]: 输入手机号码进行充值</h4>
			<h4>[话费到账]:付款成功后，系统自动发起充值，一般24小时至72小时左右到账，特殊情况3-7天到账，具体充值到账时间以运营商充值结果为准，充值过程中无法退款，充值高峰可能出现分批到账或充值失败情况，如有异常，请咨询人工客服或拨打010-86391585:</h4>
			<p>1.请核对手机号码，确认正确再充值，号码错误将无法退款，充值失败资金原路退回，无需担心。</p>
			<p>2.未实名号码、虚拟号(16611671701171号段)、副卡、销户号、携号转网号码无法充值，请勿提交，提交后无法售后3.慢充一般1-72小时到账，服务器维护或高峰期有延迟，最晚不超72小时。</p>
			<p>4.充值失败24小时内资金原路退回，急用请勿拍，下单后无法取消充值进度。</p>
			<p>5.支持全国三通(移动/联通/电信) 缴费充值，不限购、可代充，大部分到账有短信提醒。</p>
			<p>6.客服工作时间:周一至周六9:00-22:00，有问题请在工作时间添加客服微信咨询。</p>
			<p>7.请拍下前查询要充值号码的话费余额，如已停机，请查询欠费金额，以免充值后话费金额还不足。</p>
			<p>8.如充值未到账需要提供APP的话费充值记录截图，必要时需要提供手机号码服务密码，以便客服尽快核实处理。</p>
			<p>9.若订单提交后商品库存不足时，将会为您所提交的订单发起退款处理。</p>
			<p>10沉默号码需恢复使用为正常活跃类号码后可进行充值:</p>
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
            <view class="btn-item btn-item-main" :class="{ disabled }" @click="handleBuy(PayTypeEnum.ALIPAY.value)">
              <text>立即充值</text>
            </view>
          </view>
        </view>
      </view>
    </view>
	
	
	
    <!-- 详情内容弹窗 -->
	<u-popup v-model="showPopup" mode="bottom">
	  <view class="popup__coupon">
		<view class="coupon__title f-30">选择优惠券</view>
		<!-- 优惠券列表 -->
		<view class="coupon-list">
		  <scroll-view :scroll-y="true" style="height: 565rpx;">
			<view class="coupon-item" v-for="(item, index) in list.data" :key="index">
			  <view class="item-wrapper"
				:class="['color-' + (item.state.value ? CouponColors[index % CouponColors.length] : 'gray')]"
				@click="handleSelectCoupon(index)" v-if="valueIn(item.apply_range_config.applyProductIds,selectetProductTab)">
				<view class="coupon-type">{{ CouponTypeEnum[item.coupon_type].name }}</view>
				<view class="tip dis-flex flex-dir-column flex-x-center">
				  <view v-if="item.coupon_type == CouponTypeEnum.FULL_DISCOUNT.value">
					<text class="f-30">￥</text>
					<text class="money">{{ item.reduce_price }}</text>
				  </view>
				  <text class="money"
					v-if="item.coupon_type == CouponTypeEnum.DISCOUNT.value">{{ item.discount }}折</text>
				  <text class="pay-line">满{{ item.min_price }}元可用</text>
				</view>
				<view class="split-line"></view>
				<view class="content dis-flex flex-dir-column flex-x-between">
				  <view class="column-text">
					  <view class="text-title">{{ item.name }}&nbsp;&nbsp;&nbsp;*</view>
					  <view class="text-num">{{item.receive_num}}</view>张				  
				  </view>
				  <view class="bottom dis-flex flex-y-center">
					<view class="time flex-box">
					  <block v-if="item.start_time === item.end_time">{{ item.start_time }}</block>
					  <block v-else>{{ item.start_time }}~{{ item.end_time }}</block>
					</view>
				  </view>
				</view>
			  </view>
			</view>
		  </scroll-view>
		</view>
		<!-- 不使用优惠券 -->
		<view class="coupon__do_not dis-flex flex-y-center flex-x-center">
		  <view class="control dis-flex flex-y-center flex-x-center" @click="handleNotUseCoupon()">
			<text class="f-26">不使用优惠券</text>
		  </view>
		</view>
	  </view>
	</u-popup>

		

	</view>
</template>

<script>
import * as ProductApi from '@/api/product'
import * as Verify from '@/utils/verify'
import { PayTypeEnum } from '@/common/enum/order'
import { aliPayment } from '@/core/app'
import * as MyCouponApi from '@/api/myCoupon'
import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
import { CouponTypeEnum } from '@/common/enum/coupon'
  
  // 表单字段元素
  const form = {
    phone: '',
  }
  const CouponColors = ['red', 'blue', 'violet', 'yellow']
    
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
        // 优惠券列表数据
        list: getEmptyPaginateObj(),
		// 枚举类
		CouponTypeEnum,
		// 颜色组
		CouponColors,
		// 选择的优惠券
		selectCouponId: 0,
		//优惠卷适用商品范围
		coupon_range: [],
		//选中的优惠卷信息
		couponItem: {},
		// rules,
        // 按钮禁用
        disabled: false,
		PayTypeEnum,
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
	  
	  this.getCouponList()
    },
	
    methods: {

      // 刷新页面数据
      onRefreshPage() {
        const app = this
        app.isLoading = true
        Promise.all([app.getProductDetail()])
          .finally(() => app.isLoading = false)
      },
	  
	  //验证商品可以使用的优惠卷
	  valueIn(item,Id){
		  if(item.includes(Id)){
			  return true;
		  }
	  },
	  
	  //验证用户使用有可用的优惠卷
	  ArrvalueIn(list,Id){
		  try {
			  list.forEach((item, index)=>{
				  if(item.apply_range_config.applyProductIds.includes(Id)){
					 throw new Error("存在");
				  }
			  });
		  } catch(e) {
		      if(e.message =="存在") return true;
		  };
		  return false;
	  },
	  
      // 表单提交
      handleBuy(payType) {
        const app = this
        if (app.disabled) {
          return false
        }
		console.log(app.isLoading)
		if (!app.isLoading && app.validteData(app.phone)) {
		  app.submitBuy(payType)
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
		submitBuy(payType){
			const app = this
			app.disabled = true;
			app.mode = 'TgYi';
			if(app.categoryId == 10068){
				if(!app.coupon_range.includes(app.selectetProductTab)){
					app.$toast('该商品不能使用此优惠券')
					return false;
				}				
				app.mode = 'ReCh'; //话费充值
				form.couponId = app.selectCouponId || 0;
				form.reduce_price = app.couponItem.reduce_price;

			}
			form.productId = app.selectetProductTab;
			form.phone = app.phone;
			form.coupon_money = 0;
			form.payType = payType
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
			// 显示成功信息
			// app.$toast(result.message);
			console.log(result.data.payment);
			// 发起支付宝支付
			if (result.data.payType == PayTypeEnum.ALIPAY.value) {
				// aliPayment(result.data.payment)
				// 	.then(() => app.$success('支付成功'))
				// 	.catch(err => app.$error('订单未支付'))
				// 	.finally(() => {
				// 	  app.disabled = false
				// 	  app.navToMyOrder()
				// 	})
				console.log(1111);
				document.querySelector('.container').innerHTML = result.data.payment;
				document.forms[0].submit()
				app.navToMyOrder()
				
			}
		},
		
		// 跳转到我的订单(等待1秒)
		navToMyOrder() {
		  setTimeout(() => {
		    this.$navTo('pages/order/index')
		  }, 1000)
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
	  
	  // 获取优惠卷数据
	  getCouponList(){
		const app = this
		if(app.categoryId == 10068){
			return new Promise((resolve, reject) => {
			  MyCouponApi.list({ dataType: 'isUnused', page: 1 }, { load: false })
				.then(result => {
				  // 合并新数据
				  const newList = result.data.list
				  app.list.data = getMoreListData(newList, app.list, 1)
				  resolve(newList)
				})
			})			
		}else{
			return;
		}		  
		  
	  },

      // 选择优惠券
      handleSelectCoupon(index) {
        const app = this
		console.log(index);
        // const { couponList } = app.order
        // 当前选择的优惠券
        app.couponItem = app.list.data[index]
        // 记录选中的优惠券id
        app.selectCouponId = app.couponItem.user_coupon_id
		app.coupon_range = app.couponItem.apply_range_config.applyProductIds


        // 隐藏优惠券弹层
        app.showPopup = false
      },

      // 跳转到首页
      onTargetHome(e) {
        this.$navTo('pages/index/index')
      },
	  
	  //默认选项
	  handleSelectNav(data) {
		  
		  if(data.category_id == this.selectedTab){
				this.selectetProductTab = data.product_id;
				return true;
			}
	  },
	  
	  //产品默认选项
	  handleSelectCate(data) {
		  if(data.category_id == this.selectedTab){
				this.selectetProductTab = data.product_id;
		  }else{
			  this.selectedTab = data.category_id;
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
	.product-title-recharge{
		font-size:15px;
		margin: 34px 0 24px 0;
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
		margin: 0rpx 40rpx 40rpx 0rpx;
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
		
	.recharge {
		padding: 64rpx 0;
		width: 240rpx;
		
		.recharge-price{
			font-size:12px;
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
/* 优惠券选择 */
.popup__coupon {
  width: 750rpx;
  background: #fff;
  box-sizing: border-box;
  padding: 30rpx;
  
  .coupon__do_not {
    .control {
      width: 90%;
      height: 72rpx;
      margin-bottom: 24rpx;
      color: #888;
      border: 1rpx solid #e3e3e3;
      border-radius: 10rpx;
         /* #ifdef H5 */
            max-width: 1120rpx;
            /* #endif */
    }
  }
  
  .coupon__title {
    text-align: center;
    margin-bottom: 30rpx;
  }

  .coupon-list {
    /* #ifdef H5 */
     max-width: 1120rpx;
     margin: 0 auto;
    /* #endif */
  }

  .coupon-item {
    overflow: hidden;
    margin-bottom: 22rpx;
  }
  
  .item-wrapper {
    width: 100%;
    display: flex;
    background: #fff;
    border-radius: 8rpx;
    color: #fff;
    height: 180rpx;
  
    .coupon-type {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 10;
      width: 128rpx;
      padding: 6rpx 0;
      background: #a771ff;
      font-size: 20rpx;
      text-align: center;
      color: #ffffff;
      transform: rotate(45deg);
      transform-origin: 64rpx 64rpx;
    }
  
    &.color-blue {
      background: linear-gradient(-125deg, #57bdbf, #2f9de2);
    }
  
    &.color-red {
      background: linear-gradient(-128deg, #ff6d6d, #ff3636);
    }
  
    &.color-violet {
      background: linear-gradient(-113deg, #ef86ff, #b66ff5);
  
      .coupon-type {
        background: #55b5ff;
      }
    }
  
    &.color-yellow {
      background: linear-gradient(-141deg, #f7d059, #fdb054);
    }
  
    &.color-gray {
      background: linear-gradient(-113deg, #bdbdbd, #a2a1a2);
  
      .coupon-type {
        background: #9e9e9e;
      }
    }
  
    .content {
      flex: 1;
      padding: 30rpx 20rpx;
      border-radius: 16rpx 0 0 16rpx;
	  
	  .column-text{
		  
		  .text-title{
				font-size: 32rpx;
				display: inline-grid;
		  }
		  
		  .text-num{
				display: inline-grid;
				font-size: 40rpx;
		  }
		  
	  }  
      .title {
        font-size: 32rpx;
      }
	  
  
      .bottom {
        .time {
          font-size: 24rpx;
        }
  
        .receive {
          height: 46rpx;
          width: 122rpx;
          line-height: 46rpx;
          text-align: center;
          border: 1rpx solid #fff;
          border-radius: 30rpx;
          color: #fff;
          font-size: 24rpx;
  
          &.state {
            border: none;
          }
        }
      }
    }
  
    .tip {
      position: relative;
      flex: 0 0 32%;
      text-align: center;
      border-radius: 0 16rpx 16rpx 0;
  
      .money {
        font-weight: bold;
        font-size: 52rpx;
      }
  
      .pay-line {
        font-size: 22rpx;
      }
    }
  
    .split-line {
      position: relative;
      flex: 0 0 0;
      border-left: 4rpx solid #fff;
      margin: 0 10rpx 0 6rpx;
      background: #fff;
  
      &:before,
        {
        border-radius: 0 0 16rpx 16rpx;
        top: 0;
      }
  
      &:after {
        border-radius: 16rpx 16rpx 0 0;
        bottom: 0;
      }
  
      &:before,
      &:after {
        content: '';
        position: absolute;
        width: 24rpx;
        height: 12rpx;
        background: #f7f7f7;
        left: -14rpx;
        z-index: 1;
      }
  
  
    }
  }
  
}
</style>
