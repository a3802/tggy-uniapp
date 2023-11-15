<template>
  <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback" :up="upOption" @up="upCallback">
    <!-- 页面头部 -->
    <!-- 排序标签 -->
    <!-- 商品列表 -->
    <view class="goods-list clearfix column-1">
      <view class="goods-item" v-for="(item, index) in list.data" :key="index" @click="onTargetDetail(item.goods_sign)">
        <!-- 单列显示 -->
        <view v-if="showView" class="dis-flex">
          <!-- 商品图片 -->
          <view class="goods-item_left">
            <image class="image" :src="item.goods_image_url"></image>
          </view>
          <view class="goods-item_right">
            <!-- 商品名称 -->
            <view class="goods-name">
              <text class="twoline-hide">{{ item.goods_name }}</text>
            </view>
            <view class="goods-item_desc">
              <!-- 商品卖点 -->
              <view class="desc-selling_point dis-flex">
                <text class="oneline-hide">{{ item.opt_name }}</text>
              </view>
              <!-- 商品销量 -->
              <view class="desc-goods_sales dis-flex">
                已售<text style="color:red">{{ item.sales_tip }}件</text>
              </view>
              <!-- 商品价格 -->
              <view class="desc_footer">
                <text class="price_x">¥{{(item.min_group_price - item.coupon_discount)/100}}</text>
                <text class="price_y col-9" v-if="item.min_normal_price > 0">¥{{ item.min_normal_price/100 }}</text>
              </view>
			  <!-- 商品标签 -->
              <view class="desc-selling_point">
				<view class="tag-desc" v-for="(value, ke) in item.unified_tags" :key="ke">
					<text class="tag">{{ value }}</text>
				</view>
              </view>			  
            </view>
          </view>
        </view>
      </view>
    </view>
  </mescroll-body>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import * as FavoriteApi from '@/api/favorite.js'
  import * as GoodsApi from '@/api/goods'
  import { ACCESS_TOKEN, USER_ID } from '@/store/mutation-types'
  import storage from '@/utils/storage'
  import { getEmptyPaginateObj, getMoreListData,checkLogin } from '@/core/app'


  const pageSize = 20
  const showViewKey = 'GoodsList-ShowView';

  export default {
    components: {
      MescrollBody,
    },

    mixins: [MescrollMixin],

    data() {
      return {
        showView: false, // 列表显示方式 (true列表、false平铺)
        sortType: 'best', // 排序类型
        options: {}, // 当前页面参数
        list: getEmptyPaginateObj(), // 商品列表数据
		
		// 是否已登录
		isLogin: false,
		
		//防止重复弹窗
		loginModal: false,
		

        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于4条才显示无更多数据
          noMoreSize: 4,
        }
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 记录options
      this.options = options
	  
	  this.isLogin = checkLogin()

	  this.onRefreshPage()
    },

    methods: {
		
		// 刷新页面数据
		onRefreshPage() {
		  const app = this
		  Promise.all([app.getGoodsList()])
		},

      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getGoodsList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total //列表取出数据的总数
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },


      /**
       * 获取商品列表
       * @param {number} pageNo 页码
       */
      getGoodsList(pageNo = 1) {
        const app = this
		const user_id = storage.get(USER_ID)
		const page = pageNo
        return new Promise((resolve, reject) => {
          FavoriteApi.list(user_id,pageNo)
            .then(result => {
				console.log(result);
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
			  // console.log(app.list.data);
              resolve(newList)
            })
            .catch(reject)
        })
      },

      // 切换排序方式
      handleSortType(newSortType) {
        const app = this
        app.sortType = newSortType
        // 刷新列表数据
        app.list = getEmptyPaginateObj()
        app.mescroll.resetUpScroll()
      },

      // 切换列表显示方式
      handleShowView() {
        const app = this
        app.showView = !app.showView
        uni.setStorageSync(showViewKey, app.showView)
      },

      // 跳转商品详情页
      onTargetDetail(goods_sign) {
		  // console.log(goods_sign);
		  uni.navigateTo({
			url: '/pages/goods/detail?goods_sign=' + goods_sign
		  })        
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


  }
</script>

<style lang="scss" scoped>
  @import "./list.scss";
</style>
