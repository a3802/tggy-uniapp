<template>
  <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback" :up="upOption" @up="upCallback">
    <!-- 页面头部 -->
    <view class="header">
      <search class="search" :tips="options.search ? options.search : '搜索商品'" @event="handleSearch" />
      <!-- 切换列表显示方式 -->
      <view class="show-view" @click="handleShowView">
        <text class="iconfont icon-view-tile" v-if="showView"></text>
        <text class="iconfont icon-view-list" v-else></text>
      </view>
    </view>

    <!-- 排序标签 -->
    <view class="store-sort">
      <view class="sort-item" :class="{ active: sortType === 'best' }" @click="handleSortType('best')">
        <text>热销榜</text>
      </view>
      <view class="sort-item" :class="{ active: sortType === 'recommend' }" @click="handleSortType('recommend')">
        <text>推荐榜</text>
      </view>
      <view class="sort-item sort-item-price" :class="{ active: sortType === 'billion' }" @click="handleSortType('billion')">
        <text>百亿补贴</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list clearfix" :class="['column-' + (showView ? '1' : '2')]">
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
        <!-- 多列显示 -->
        <view v-else class="">
          <!-- 商品图片 -->
          <view class="goods-image">
            <image class="image" mode="aspectFill" :src="item.goods_image_url"></image>
          </view>
          <view class="detail">
            <!-- 商品标题 -->
            <view class="goods-name">
              <text class="twoline-hide">{{ item.goods_name }}</text>
            </view>
            <!-- 商品价格 -->
            <view class="detail-price oneline-hide">
              <text class="goods-price f-30 col-m">￥{{(item.min_group_price - item.coupon_discount)/100}}</text>
              <text v-if="item.min_normal_price > 0" class="line-price col-9 f-24">￥{{ item.min_normal_price/100 }}</text>
            </view>
			<!-- 商品销量 -->
			<view class="desc-sales dis-flex">
				<text style="color:white">{{ item.sales_tip }}件</text>
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
  import * as GoodsApi from '@/api/goods'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import Search from '@/components/search'

  const pageSize = 20
  const showViewKey = 'GoodsList-ShowView';

  export default {
    components: {
      MescrollBody,
      Search
    },

    mixins: [MescrollMixin],

    data() {
      return {
        showView: false, // 列表显示方式 (true列表、false平铺)
        sortType: 'best', // 排序类型
        options: {}, // 当前页面参数
        list: getEmptyPaginateObj(), // 商品列表数据

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
      // 设置默认列表显示方式
      this.setShowView()
    },
	async onShow(options){
		this.options.search = uni.getStorageSync('inputSearch');
		await this.getGoodsList();
	},

    methods: {

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
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      // 设置默认列表显示方式
      setShowView() {
        this.showView = uni.getStorageSync(showViewKey) || false
      },

      /**
       * 获取商品列表
       * @param {number} pageNo 页码
       */
      getGoodsList(pageNo = 1) {
        const app = this
        const param = {
          sortType: app.sortType,
          goodsName: uni.getStorageSync('inputSearch') || '',
          page: pageNo
        }
		
        return new Promise((resolve, reject) => {
          GoodsApi.list(param)
            .then(result => {
              // 合并新数据
              const newList = result.data.list
              app.list.data = getMoreListData(newList, app.list, pageNo)
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

      /**
       * 商品搜索
       */
      handleSearch() {
        const searchPageUrl = 'pages/search/index'
        // 判断来源页面
        let pages = getCurrentPages()
        if (pages.length > 1 &&
          pages[pages.length - 2].route === searchPageUrl) {
          uni.navigateBack()
          return
        }
        // 跳转到商品搜索页
        this.$navTo(searchPageUrl)
      }

    },


  }
</script>

<style lang="scss" scoped>
  @import "./list.scss";
</style>
