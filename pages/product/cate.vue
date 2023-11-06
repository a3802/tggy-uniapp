<template>
	<view v-show="!isLoading" class="container">
		<!-- 权益商品详情页面 -->	
		<view class="header"></view>
		<!-- 权益商品 -->
		<!-- 充值：手机号 -->
		<view class="i-card">
			<view class="order-status">
				<view class="status-icon">
				  <!-- 商品图标-->
					<image  class="image" :src="subInfo.image_url" mode="aspectFit"></image>
				</view>
				<view class="status-text">
				  <text >{{ subInfo.name }}</text>
				</view>
			</view>				
			<view class="sub_content">
				<text class="iconfont icon-help"></text>
				<text class="text-help">请确保账号无误，充值成功后不支持退换</text>
			</view>
		</view>						
						
		

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
		
	</view>
	
</template>

<script>
import * as ProductApi from '@/api/product'
import { PayTypeEnum } from '@/common/enum/order'
import { getEmptyPaginateObj, getMoreListData  } from '@/core/app'
import * as GoodsApi from '@/api/goods'
import * as PushSubApi from '@/api/subscribe.js'

const pageSize = 20 
    
  export default {
    components: {
    },
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
		console.log(11111);

      this.subId = parseInt(options.subId)

	  //调用订阅推送基本信息
	  this.getPushInfo()
	  
	  this.getGoodsList()
      // 加载页面数据
      this.onRefreshPage()
	  
    },
	
    methods: {

      // 刷新页面数据
      onRefreshPage() {
        const app = this
        app.isLoading = true
        Promise.all([app.getGoodsList()])
          .finally(() => app.isLoading = false)
      },
	  
	  getPushInfo(){
		const app = this
        return new Promise((resolve, reject) => {
          PushSubApi.detail(app.subId)
            .then(result => {
				console.log(result);
				
				app.subInfo = result.data.SubInfo
              // 合并新数据
              resolve(result)
            })
            .catch(reject)
        })		  
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
      height: 200rpx;
	  margin: 40rpx;
	  margin-top: 50px;

      .status-icon {
        width: 128rpx;
        height: 128rpx;
		
		

        .image {
          display: block;
          width: 100%;
          height: 100%;
		  margin-top: -32px;
        }
      }

      .status-text {
        padding-left: 20rpx;
        font-size: 54rpx;
        font-weight: bold;
      }
    }

	
  
  // 通栏卡片
  .i-card {
    background: #fff;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    // margin: -76rpx auto 20rpx auto;
    border-radius: 20rpx;
	     margin-top: -102px;
	     margin-bottom: 20px;
	     margin-left: 12px;
	
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
