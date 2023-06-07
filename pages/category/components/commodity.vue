<template>
  <view class="container">
    <!-- 一级分类 -->
    <scroll-view class="cate-left" :scroll-y="true" :style="{ height: `${scrollHeight}px` }" @touchmove.stop.prevent>
      <text class="type-nav" :class="{ selected: curIndex == -1 }" @click="handleSelectNav(-1)">全部</text>
      <text class="type-nav" :class="{ selected: curIndex == index }" v-for="(item, index) in list" :key="index" @click="handleSelectNav(index)">{{ item.name }}</text>
    </scroll-view>

    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ use: false }" :up="upOption" :bottombar="false" @up="upCallback">

      <view class="cate-content">
        <!-- 商品列表 -->
			<scroll-view class="cate-right" :scroll-top="scrollTop" :scroll-y="true"
				:style="{ height: `${scrollHeight}px` }">
				<view v-if="productList.data" class="cate-right-cont">
					<view class="cate-two-box">
						<view class="cate-cont-box">
							<view class="flex-three" v-for="(item, index) in productList.data" :key="index" @click="onTargetProduct(item.product_id)">
								<view class="cate-img-padding">
									<view v-if="item.product_image" class="cate-img">
										<image class="image" mode="scaleToFill" :src="item.product_image"></image>
									</view>
									<text class="name oneline-hide">{{ item.short_name }}</text>
									<text class="name_desc oneline-hide">{{ item.short_desc }}</text>									
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
        <!-- 遮罩层 -->
        <view class="mask" v-show="showSubCate" @touchmove.stop.prevent @click="handleShowSubCate"></view>
        <!-- 加入购物车组件 -->
      </view>
    </mescroll-body>
  </view>
</template>

<script>
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData, setCartTabBadge } from '@/core/app'
  import { PageCategoryStyleEnum } from '@/common/enum/store/page/category'
  import Empty from '@/components/empty'
  import { rpx2px } from '@/utils/util'
  import * as ProductApi from '@/api/product'

  const pageSize = 15

  export default {
    components: {
      MescrollBody,
      Empty,
    },
    mixins: [MescrollMixin],
    props: {
      // 分类列表
      list: {
        type: Array,
        default: []
      },
      // 分类设置
      setting: {
        type: Object,
        default: () => {}
      },
    },
    data() {
      return {
        // 枚举类
        PageCategoryStyleEnum,
        // 列表高度
        scrollHeight: 0,
        // 一级分类：指针
        curIndex: -1,
        // 是否显示子分类
        showSubCate: false,
        // 二级分类：指针
        curIndex2: -1,
        // 权益商品列表
        productList: getEmptyPaginateObj(),
        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于3条才显示无更多数据
          noMoreSize: 3,
          // 返回顶部
          toTop: { right: 30, bottom: 48, zIndex: 9 }
        },
		// 内容区竖向滚动条位置
		scrollTop: 0,
      }
    },
    created() {
      // 设置分类列表高度
      this.setListHeight()
    },
    computed: {
      // 二级分类列表
      subCateList() {
        if (this.list[this.curIndex] && this.list[this.curIndex].children) {
          return this.list[this.curIndex].children
        }
        return []
      }
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
        app.getProductList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      /**
       * 获取权益商品列表
       * @param {Number} pageNo 页码
       */
      getProductList(pageNo = 1) {
        const app = this
        const categoryId = app.getCategoryId()
        return new Promise((resolve, reject) => {
          ProductApi.list({ categoryId, page: pageNo }, { load: false })
            .then(result => {
              const newList = result.data.list
              app.productList.data = getMoreListData(newList, app.productList, pageNo)
              app.productList.last_page = newList.last_page
              resolve(newList)
            })
            .catch(reject)
        })
      },

      // 获取当前选择的分类ID
      getCategoryId() {
        const app = this
        if (app.curIndex2 > -1) {
          return app.subCateList[app.curIndex2].category_id
        }
        return app.curIndex > -1 ? app.list[app.curIndex].category_id : 0
      },

      // 设置列表内容的高度
      setListHeight() {
        const { windowHeight } = uni.getSystemInfoSync()
        this.scrollHeight = windowHeight - rpx2px(88)
      },

      // 一级分类：选中分类
      handleSelectNav(index) {
        this.curIndex = index
        this.onRefreshList()
        this.showSubCate = false
        this.curIndex2 = -1
		this.scrollTop = 0
      },

      // 刷新列表数据
      onRefreshList() {
        this.productList = getEmptyPaginateObj()
        setTimeout(() => this.mescroll.resetUpScroll(), 120)
      },

      // 跳转至权益商品列表页
      onTargetProduct(productIds) {
        this.$navTo('pages/product/detail', { productIds })
      },

      // 切换子分类显示状态
      handleShowSubCate() {
        this.showSubCate = !this.showSubCate
      }

    }
  }
</script>

<style lang="scss" scoped>
  .container {
    padding-left: 173rpx;
  }

  // 分类内容
  .cate-content {
    z-index: 1;
    background: #fff;
    padding-top: 88rpx;
    min-height: 300rpx;
  }

  // 一级分类+二级分类 20
  .cate-left {
    position: fixed;
    top: calc(88rpx + var(--window-top));
    left: var(--window-left);
    bottom: var(--window-bottom);
    width: 173rpx;
    height: 100%;
    background: #f8f8f8;
    color: #444;
  }

  // 左侧一级分类
  .type-nav {
    position: relative;
    height: 90rpx;
    z-index: 10;
    display: block;
    font-size: 26rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    &.selected {
      background: #fff;
      border-right: none;
      font-size: 28rpx;
      color: #fa2209;
    }
  }

  
  // 右侧二级分类
  .cate-cont-box {
  	margin-bottom: 30rpx;
  	padding-bottom: 10rpx;
  	background: #fff;
  	overflow: hidden;
  
  	.name {
  		display: block;
  		padding-bottom: 10rpx;
  		text-align: center;
  		font-size: 22rpx;
  		color: #444444;
  	}
	.name_desc {
  		display: block;
  		padding-bottom: 10rpx;
  		text-align: center;
  		font-size: 22rpx;
  		color: #a39d9d;		
	}
  
  	.cate-img-padding {
  		padding: 16rpx 16rpx 0rpx 16rpx;
  	}
  
  	.cate-img {
  		position: relative;
  		width: 100%;
  		padding-top: 100%;
  
  		.image {
  			width: 114rpx;
  			height: 114rpx;
  			position: absolute;
  			top: 0;
  			left: 0;
  			border-radius: 100%;
			border:0.5px solid #ddd;
			overflow: hidden;
			margin: 20rpx 20rpx;
  		}
  	}
  
  }
  
  .cate-right {
  	display: flex;
  	flex-direction: column;
  	height: 100%;
  	overflow: hidden;
  
  	.cate-right-cont {
  		width: 100%;
  		display: flex;
  		flex-flow: row wrap;
  		align-content: flex-start;
  		padding-top: 15rpx;
  
  		.cate-two-box {
  			width: 100%;
  			padding: 0 10px;
  		}
  	}
  }
  
  

  // 子分类遮罩层
  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 8;
    background-color: rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease-in-out 0s;
  }
</style>
