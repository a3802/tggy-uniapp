<template>
	<view v-show="!isLoading" class="container">
		<!-- 权益商品详情页面 -->	
		<view class="header"></view>
		<view class="i-card">
			<view class="order-status">
				<view class="status-icon">
				  <!-- 商品图标-->
					<image  class="image" :src="subInfo.image_url" mode="aspectFit"></image>
				</view>
				<view class="status-text">
				  <text class="status_text_name">{{ subInfo.name }}</text>
				  <text class="status_text_num">{{ subInfo.rand_num }}人喜欢</text>
				</view>
			</view>				
			<view class="sub_content">
				<!-- <text class="iconfont icon-help"></text> -->
				<text class="text-help">{{subInfo.sub_desc}}</text>
			</view>
		</view>						
						
		
	<mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="goods-list clearfix column-1">
			<view class="goods-item" v-for="(item, index) in list.data" :key="index" @click="onTargetDetail(item.goods_sign)">
				<!-- 单列显示 -->
				<view class="dis-flex">
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
	</view>
	
</template>

<script>
import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
import * as ProductApi from '@/api/product'
import { PayTypeEnum } from '@/common/enum/order'
import { getEmptyPaginateObj, getMoreListData  } from '@/core/app'
import * as GoodsApi from '@/api/goods'
import * as PushSubApi from '@/api/subscribe.js'

const pageSize = 20 
    
  export default {
    components: {
		MescrollBody
    },
	mixins: [MescrollMixin],
    data() {
      return {
        // 正在加载
        isLoading: true,
        // 当前订阅推送ID
        subId: null,
        // 显示详情内容弹窗
        showPopup: false,
		//上级分类项目
		selectedTab: 0,
		//商品选项卡
		selectetProductTab: 0,
		//订阅数据
		subInfo: {},
		// rules,
        // 按钮禁用
        disabled: false,
		PayTypeEnum,
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
      // 记录商品ID
		// console.log(11111);

      this.subId = parseInt(options.subId)

	  //调用订阅推送基本信息
      // 加载页面数据
      this.onRefreshPage()
	  
    },
	
	
    methods: {

      // 刷新页面数据
      onRefreshPage() {
        const app = this
        app.isLoading = true
        Promise.all([app.getPushInfo()])
          .finally(() => app.isLoading = false)
      },
	  
      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getPushInfo(page.num)
          .then(result => {
            const curPageLen = result.data.list.data.length
            const totalSize = result.data.list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },
	  
	  getPushInfo(pageNo = 1){
		const app = this
        return new Promise((resolve, reject) => {
          PushSubApi.detail(app.subId,pageNo)
            .then(result => {
				// console.log(result);
				
				app.subInfo = result.data.subInfo
				const newList = result.data.list
				// console.log(newList);
				app.list.data = getMoreListData(newList, app.list, pageNo)	
              // 合并新数据
              resolve(result)
            })
            .catch(reject)
        })		  
	  },
	  
	  // 跳转商品详情页
	  onTargetDetail(goods_sign) {
		  // console.log(goods_sign);
		uni.navigateTo({
			url: '/pages/goods/detail?goods_sign=' + goods_sign
		})        
	  },
			  
		// 跳转到我的订单(等待1秒)
		navToMyOrder() {
		  setTimeout(() => {
		    this.$navTo('pages/order/index')
		  }, 1000)
		},
	  
	  
    },

  }
</script>

<style>
  page {
    background: #fafafa;
  }
</style>
<style>
	@import "./cate.scss";
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
    height: 300rpx;
	justify-content: center;
	flex-direction: column;
	
	}
    .order-status {
      display: flex;
      align-items: center;
      height: 120rpx;
	  margin: 40rpx 40rpx 0 40rpx;
	  margin-top: 160rpx;

      .status-icon {
        width: 180rpx;
        height: 180rpx;
		
		

        .image {
          display: block;
          width: 100%;
          height: 100%;
		  margin-top: -32px;
		  border-radius: 15rpx;
		  border: 2rpx solid;
		  border-color:#fff;
        }
      }

      .status-text {
        padding-left: 30rpx;
        font-size: 38rpx;
        font-weight: bold;
		line-height: 44rpx;
		// margin-bottom: 60rpx; 
		
		.status_text_num{
			font-size:24rpx !important;
			color:#bdbdbd !important;
			display: block;
		}
      }
    }

	
  
  // 通栏卡片
  .i-card {
    background: #fff;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    height: 200rpx;
    border-radius: 20rpx;
	margin-top: -240rpx;
	margin-bottom: 30rpx;
	margin-left: 12px;
	
	.iconfont {
		font-size:40rpx;
		position: relative;
		color:#e8c269;
		top:6rpx;
	}
	.text-help{
		font-size:24rpx;
		margin-left: 50rpx;
		color:#353434;
		font-weight: 605;
		
	}
	.u-border-bottom:after {
		border-bottom-width:0px
	}
	
		
}

.u-input__input {
	font-size:24px !important;
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


  
}  

</style>
