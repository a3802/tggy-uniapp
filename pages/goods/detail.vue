<template>

  <view v-show="!isLoading" class="container">
    <!-- 商品图片轮播 -->
    <SlideImage v-if="!isLoading" :video="goods.video_urls[0]" :videoCover="goods.goods_thumbnail_url" :images="goods.goods_gallery_urls" />

    <!-- 商品信息 -->
    <view v-if="!isLoading" class="goods-info m-top20">
      <!-- 价格、销量 -->
      <view class="info-item info-item__top dis-flex flex-x-between flex-y-end">
        <view class="block-left dis-flex flex-y-center">
          <!-- 商品售价 -->
          <text class="floor-price__samll">￥</text>
          <text class="floor-price">{{(goods.min_group_price - goods.coupon_discount)/100}}</text>
          <!-- 会员价标签 -->
          <view v-if="goods.is_user_grade" class="user-grade">
            <text>会员价</text>
          </view>
          <!-- 划线价 -->
          <text v-if="goods.min_normal_price > 0" class="original-price">￥{{ goods.min_group_price/100 }}</text>
        </view>
        <view class="block-right dis-flex">
          <!-- 销量 -->
          <view class="goods-sales">
            <text>已售{{ goods.sales_tip }}件</text>
          </view>
        </view>
      </view>
      <!-- 标题、分享 -->
      <view class="info-item info-item__name dis-flex flex-y-center">
        <view class="goods-name flex-box">
		  <image class="image" :draggable="false" :src="goods.brand_type"></image>
          <text class="twoline-hide">{{ goods.goods_name }}</text>
        </view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="goods-share__line"></view>
        <view class="goods-share">
          <button class="share-btn dis-flex flex-dir-column" open-type="share">
            <text class="share__icon iconfont icon-fenxiang"></text>
            <text class="f-24">分享</text>
          </button>
        </view>
        <!-- #endif -->
      </view>
      <!-- 商品卖点 -->	 
		<view class="desc-selling_point">
			<view class="tag-desc" v-for="(value, ke) in goods.unified_tags" :key="ke">
				<text class="tag">{{ value }}</text>
			</view>
		</view>  
	
    </view>


    <!-- 商品服务 -->
    <Service v-if="!isLoading" :service_tags="goods.service_array" />
	
	
	<!---店铺明细和优惠卷 -->
	<view v-if="!isLoading" class="goods-info m-top20 goods_brand_detail">
		<view class="goods_discount">
			<text class="goods_discount_text">优惠卷金额(元)</text>
			<text class="goods_discount_count">{{ goods.coupon_discount/100 }}</text>
		</view>
		<view class="goods_point"></view>
		<view class="goods_discount">
			<text class="goods_discount_text">优惠卷数量(张)</text>
			<text class="goods_discount_count">{{ goods.coupon_total_quantity }}</text>
		</view>
		<view class="goods_point"></view>
		<view class="goods_discount">
			<text class="goods_discount_text">券后价(元)</text>
			<text class="goods_discount_count">{{(goods.min_group_price - goods.coupon_discount)/100}}</text>	
			<span class="coupon_expire">有效期:{{ goods.coupon_start_time }}-{{goods.coupon_end_time}}</span>		
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
          <!-- 客服 (仅微信小程序端显示) -->
          <!-- #ifdef MP-WEIXIN -->
          <button class="btn-normal" open-type="contact">
            <view class="fast-item">
              <view class="fast-icon">
                <text class="iconfont icon-kefu1"></text>
              </view>
              <view class="fast-text">
                <text>客服</text>
              </view>
            </view>
          </button>
          <!-- #endif -->
          <!-- 收藏 -->
          <view class="fast-item fast-item--cart" @click="onFavorite()">
            <view v-if="cartTotal > 0" class="fast-badge fast-badge--fixed">{{ cartTotal > 99 ? '99+' : cartTotal }}
            </view>
            <view class="fast-icon">
              <text class="iconfont" :class="['icon-a-xihuan'+(isFavorite ? '2' : '1')]"></text>
            </view>
            <view class="fast-text">
              <text>收藏</text>
            </view>
          </view>
        </view>
        <!-- 操作按钮 -->
        <view class="foo-item-btn">
          <view class="btn-wrapper">
            <view class="btn-item btn-item-main" @click="onTargetUrl(goods.url)">
              <text>直达链接</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷导航 -->
    <!-- <shortcut bottom="120rpx" /> -->

  </view>
</template>

<script>
  import { ACCESS_TOKEN, USER_ID } from '@/store/mutation-types'
  import { checkLogin } from '@/core/app'
  import {appUnilogin} from '@/utils/login.js'
  import storage from '@/utils/storage'
  import * as GoodsApi from '@/api/goods'
  import * as FavoriteApi from '@/api/favorite.js'
  import SlideImage from './components/SlideImage'
  import Service from './components/Service'
  import timeFormat from '@/uview-ui/libs/function/timeFormat.js';

  export default {
    components: {
      // Shortcut,
      SlideImage,
      // SkuPopup,
      // Comment,
      Service
    },
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 当前商品ID
        goods_sign: null,
		// 是否已登录
		isLogin: false,
		// 是否收藏
		isFavorite: false,
        // 商品详情
        goods: {},
        // 购物车总数量
        cartTotal: 0,
        // 显示/隐藏SKU弹窗
        showSkuPopup: false,
        // 模式 1:都显示 2:只显示购物车 3:只显示立即购买
        skuMode: 1,
		//防止重复弹窗
		loginModal: false
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 记录商品ID
      this.goods_sign = options.goods_sign
	  
	  
	  // 判断是否已登录
	  this.isLogin = checkLogin()
	  // console.log(this.goods_sign);
      // 加载页面数据
      this.onRefreshPage()
    },

    methods: {

      // 刷新页面数据
      onRefreshPage() {
        const app = this
        app.isLoading = true
        Promise.all([app.getFavorite(),app.getGoodsDetail()])
          .finally(() => app.isLoading = false)
      },

      // 获取商品信息
      getGoodsDetail() {
        const app = this
        return new Promise((resolve, reject) => {
          GoodsApi.detail(app.goods_sign)
            .then(result => {
              app.goods = result.data.detail
              resolve(result)
            })
            .catch(reject)
        })
      },
	  
	  // 获取用户是否收藏该商品
	  getFavorite(){
        const app = this
		const user_id = storage.get(USER_ID)
        return new Promise((resolve, reject) => {
          FavoriteApi.detail(user_id,app.goods_sign)
            .then(result => {
				if(result.data.detail == null){
					app.isFavorite = false;
				}else{
					app.isFavorite = result.data.detail.is_favorite
				}
			  
              resolve(result)
            })
            .catch(reject)
        })		  
	  },



      // 跳转到首页
      onTargetHome(e) {
        this.$navTo('pages/index/index')
      },

      // 跳转到第三方中间页面
      onTargetUrl(item) {
		  const app = this;
		  //判断手机是否安装三方app
		  console.log(item);
		   uni.navigateTo({
				url: '/pages/common/appToapp?schema_url=' + item.schema_url + '&short_url=' + item.short_url + '&plat=pdd'
		   })  
      },
	  

	  
	  //喜欢该商品,收藏
	  onFavorite(){
		  // console.log(goods_sign);
		  const app = this
		  const user_id = storage.get(USER_ID)
		  if(!app.isLogin){
			 app.userLogin(); 
		  }else{
			return new Promise((resolve, reject) => {
			  FavoriteApi.favorite(user_id, app.goods_sign, !app.isFavorite)
				.then(result => {
				  app.isFavorite = !app.isFavorite;
				  resolve(result)
				})
				.catch(reject)
			})		  
		  }
		  // storage.get(USER_ID)
	  },
	  
	  //登录提示
	  userLogin(){
		  if(!this.loginModal){
			  this.loginModal = true
			  // 弹窗告诉用户去登录
			  uni.showModal({
				title: '温馨提示',
				content: '此时此刻需要您登录喔~',
				// showCancel: false,
				confirmText: "去登录",
				cancelText: "再逛会",
				success: res => {
				  if (res.confirm) {
						  
					//#ifdef APP-PLUS
						let rest = appUnilogin();
					//#endif
					//#ifdef H5
						  uni.navigateTo({
							url: "/pages/login/index"
						  })	
					//#endif
				  }
				  if (res.cancel && getCurrentPages().length > 1) {
					uni.navigateBack()
				  }
				  this.loginModal = false
				}
			  })				  
		  }
	  
	  }


    },

    /**
     * 分享当前页面
     */
    onShareAppMessage() {
      const app = this
      // 构建页面参数
      const params = app.$getShareUrlParams({
        goodsId: app.goodsId,
      })
      return {
        title: app.goods.goods_name,
        path: `/pages/goods/detail?${params}`
      }
    },

    /**
     * 分享到朋友圈
     * 本接口为 Beta 版本，暂只在 Android 平台支持，详见分享到朋友圈 (Beta)
     * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share-timeline.html
     */
    onShareTimeline() {
      const app = this
      // 构建页面参数
      const params = app.$getShareUrlParams({
        goodsId: app.goodsId,
      })
      return {
        title: app.goods.goods_name,
        path: `/pages/goods/detail?${params}`
      }
    }
  }
</script>

<style>
  page {
    background: #fafafa;
  }
  .uni-page-head{
	  display:none;
  }
  .icon-a-xihuan2{
	  color:#e46161;
  }
</style>
<style lang="scss" scoped>
  @import "./detail.scss";
</style>
