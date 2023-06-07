<template>
  <view v-show="!isLoading" class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit">
		
	<!-- 权益商品详情页面 -->	
		<view class="product_info" v-show="!isLoading">
			
		</view>
		
	</mescroll-body>
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
              app.product = result.data.detail
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
</style>
