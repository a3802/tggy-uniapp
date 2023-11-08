<template>
  <view class="container">
    <mescroll-body ref="mescrollRef" :sticky="true" @init="mescrollInit" :down="{ native: true }" @down="downCallback" :up="upOption" @up="upCallback">

      <!-- tab栏 -->
      <u-tabs :list="tabs" :is-scroll="false" :current="curTab" active-color="#FA2209" :duration="0.2" @change="onChangeTab" />

      <!-- 订单列表 -->
      <view class="order-list">
        <view class="order-item" v-for="(item, index) in list.data" :key="index">
          <view class="item-top">
            <view class="item-top-left">
              <text class="order-time">会员权益商品</text>
            </view>
            <view class="item-top-right">
              <text class="state-text">{{ item.state_text }}</text>
            </view>
          </view>
          <!-- 商品列表 -->
          <view class="goods-list">
            <view class="goods-item">
              <!-- 商品图片 -->
              <view class="goods-image">
                <image class="image" :src="item.product_image" mode="scaleToFill"></image>
              </view>
              <!-- 商品信息 -->
              <view class="goods-content">
                <view class="goods-title"><text class="twoline-hide">{{ item.product_short_name }}</text></view>
                <view class="goods-props clearfix">
                  <view class="goods-props-item">
                    <text>订单号: &nbsp;&nbsp;&nbsp;{{ item.order_sn }}</text>
					<text>下单时间:&nbsp;&nbsp;&nbsp;{{ item.create_time }}</text>
					<text>充值帐号:&nbsp;&nbsp;&nbsp;{{ item.user_count }}</text>
                  </view>
                </view>
              </view>
              <!-- 交易信息 -->
            </view>
          </view>
		  <view class="line"></view>
          <!-- 订单合计 -->
          <view class="order-total">
            <text>共{{ item.total_num }}件商品，总金额</text>
            <text class="unit">￥</text>
            <text class="money">{{ item.pay_price }}</text>
          </view>
		  <view class="time timeplus" v-if="item.order_status == OrderStatusEnum.WAITING.value">
				<text>剩余</text>
				<u-count-down ref="uCountDown" 
				:timestamp="item.pay_time + 172800 - CurTime" 
				:show-days="false" 
				:show-border="true" 
				font-size="26"
				bg-color="#ff0000"
				color="#ffffff"
				font-family="fantasy">
				</u-count-down>
				<text>充值成功</text>
		  </view>
          <!-- 订单操作 -->
          <view v-if="item.order_status != OrderStatusEnum.CANCELLED.value" class="order-handle">
            <view class="btn-group clearfix">
              <!-- 未支付取消订单 -->
              <block v-if="item.pay_status == PayStatusEnum.PENDING.value">
                <view class="btn-item" @click="onCancel(item.order_product_id)">取消</view>
              </block>
              <!-- 已支付进行中的订单 -->
              <block v-if="item.order_status != OrderStatusEnum.APPLY_CANCEL.value">
                <block v-if="item.pay_status == PayStatusEnum.SUCCESS.value && item.delivery_status == DeliveryStatusEnum.NOT_DELIVERED.value">
                  <view class="btn-item" @click="onCancel(item.order_product_id)">申请取消</view>
                </block>
              </block>
              <!-- 已申请取消 -->
              <view v-else class="f-28 col-8">取消申请中</view>
              <!-- 未支付的订单 -->
              <block v-if="item.pay_status == PayStatusEnum.PENDING.value">
                <view class="btn-item active" @click="onPay(item.order_product_id)">去支付</view>
              </block>
            </view>
          </view>

        </view>
      </view>
    </mescroll-body>

    <!-- 支付方式弹窗 -->
    <u-popup v-model="showPayPopup" mode="bottom" border-radius="26" :closeable="true">
      <view class="pay-popup">
        <view class="title">请选择支付方式</view>
        <view class="pop-content">
          <!-- 微信支付 -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="pay-item dis-flex flex-x-between" @click="onSelectPayType(PayTypeEnum.WECHAT.value)">
            <view class="item-left dis-flex flex-y-center">
              <view class="item-left_icon wechat">
                <text class="iconfont icon-wechat-pay"></text>
              </view>
              <view class="item-left_text">
                <text>{{ PayTypeEnum.WECHAT.name }}</text>
              </view>
            </view>
          </view>
          <!-- #endif -->
          <!-- 支付宝支付 -->
          <view class="pay-item dis-flex flex-x-between" @click="onSelectPayType(PayTypeEnum.ALIPAY.value)">
            <view class="item-left dis-flex flex-y-center">
              <view class="item-left_icon balance">
                <text class="iconfont icon-balance-pay"></text>
              </view>
              <view class="item-left_text">
                <text>{{ PayTypeEnum.ALIPAY.name }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-popup>

  </view>

</template>

<script>
  import {
    DeliveryStatusEnum,
    DeliveryTypeEnum,
    OrderStatusEnum,
    PayStatusEnum,
    PayTypeEnum,
    ReceiptStatusEnum
  } from '@/common/enum/order'
  import MescrollBody from '@/components/mescroll-uni/mescroll-body.vue'
  import MescrollMixin from '@/components/mescroll-uni/mescroll-mixins'
  import { getEmptyPaginateObj, getMoreListData } from '@/core/app'
  import * as OrderApi from '@/api/order'
  import { aliPayment } from '@/core/app'
  import * as OrderProductApi from '@/api/product'

  // 每页记录数量
  const pageSize = 15

  // tab栏数据
  const tabs = [{
    name: `全部`,
    value: 'all'
  }, {
    name: `待支付`,
    value: 'willpay'
  }, {
    name: `充值中`,
    value: 'paieding'
  }, {
    name: `充值成功`,
    value: 'paysuccess'
  }]

  export default {
    components: {
      MescrollBody
    },
    mixins: [MescrollMixin],
    data() {
      return {
        // 枚举类
        DeliveryStatusEnum,
        DeliveryTypeEnum,
        OrderStatusEnum,
        PayStatusEnum,
        PayTypeEnum,
        ReceiptStatusEnum,
		//当前时间
		CurTime: new Date().getTime()/1000,
        // 当前页面参数
        options: { dataType: 'all' },
        // tab栏数据
        tabs,
        // 当前标签索引
        curTab: 0,
        // 订单列表数据
        list: getEmptyPaginateObj(),

        // 上拉加载配置
        upOption: {
          // 首次自动执行
          auto: true,
          // 每页数据的数量; 默认10
          page: { size: pageSize },
          // 数量要大于4条才显示无更多数据
          noMoreSize: 4,
          // 空布局
          empty: {
            tip: '亲，暂无订单记录'
          }
        },
        // 控制onShow事件是否刷新订单列表
        canReset: false,
        // 支付方式弹窗
        showPayPopup: false
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 初始化当前选中的标签
      this.initCurTab(options)
      // 注册全局事件订阅: 是否刷新订单列表
	  uni.$on('syncRefresh', canReset => {
		this.canReset = canReset
	  })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.canReset && this.onRefreshList()
      this.canReset = false
    },

    /**
     * 生命周期函数--监听页面的卸载
     */
    onUnload() {
      // 卸载全局事件订阅
      uni.$off('syncRefresh')
    },

    methods: {

      // 初始化当前选中的标签
      initCurTab(options) {
        const app = this
        if (options.dataType) {
          const index = app.tabs.findIndex(item => item.value == options.dataType)
          app.curTab = index > -1 ? index : 0
        }
      },

      /**
       * 上拉加载的回调 (页面初始化时也会执行一次)
       * 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10
       * @param {Object} page
       */
      upCallback(page) {
        const app = this
        // 设置列表数据
        app.getOrderList(page.num)
          .then(list => {
            const curPageLen = list.data.length
            const totalSize = list.data.total
            app.mescroll.endBySize(curPageLen, totalSize)
          })
          .catch(() => app.mescroll.endErr())
      },

      // 获取订单列表
      getOrderList(pageNo = 1) {
        const app = this
        return new Promise((resolve, reject) => {
          OrderProductApi.orderlist({ dataType: app.getTabValue(), page: pageNo }, { load: false })
		  // OrderApi.list({ dataType: app.getTabValue(), page: pageNo }, { load: false })
            .then(result => {
				// console.log(result);
              // 合并新数据
              const newList = app.initList(result.data.list)
              app.list.data = getMoreListData(newList, app.list, pageNo)
              resolve(newList)
            })
        })
      },

      // 初始化订单列表数据
      initList(newList) {
        newList.data.forEach(item => {
          item.total_num = 1
        })
        return newList
      },

      // 获取当前标签项的值
      getTabValue() {
        return this.tabs[this.curTab].value
      },

      // 切换标签项
      onChangeTab(index) {
        const app = this
        // 设置当前选中的标签
        app.curTab = index
        // 刷新订单列表
        app.onRefreshList()
      },

      // 刷新订单列表
      onRefreshList() {
        this.list = getEmptyPaginateObj()
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 120)
      },

      // 取消订单
      onCancel(orderId) {
        const app = this
        uni.showModal({
          title: '友情提示',
          content: '确认要取消该订单吗？',
          success(o) {
            if (o.confirm) {
              OrderProductApi.cancel(orderId)
                .then(result => {
                  // 显示成功信息
                  app.$toast(result.message)
                  // 刷新订单列表
                  app.onRefreshList()
                })
            }
          }
        });
      },

      // 点击去支付
      onPay(orderId) {
        // 记录订单id
        this.payOrderId = orderId
        // 显示支付方式弹窗
        this.showPayPopup = true
      },

      // 选择支付方式
      onSelectPayType(payType) {
        const app = this
        // 隐藏支付方式弹窗
        this.showPayPopup = false
        // 发起支付请求
        OrderProductApi.payAgain(app.payOrderId, payType)
          .then(result => app.onSubmitCallback(result))
      },

      // 订单提交成功后回调
      onSubmitCallback(result) {
        const app = this
        // 发起微信支付
        if (result.data.payType == PayTypeEnum.ALIPAY.value) {
			
			// #ifdef APP-PLUS
				uni.setStorageSync('alipay_str', result.data.payment)
				app.$navTo('pages/common/payment')
			// #endif
			// #ifdef H5
				document.querySelector('.container').innerHTML = result.data.payment;
				document.forms[0].submit()
				app.navToMyOrder();
			// #endif
			
        }
      },
	  

    },

  }
</script>

<style lang="scss" scoped>
  // 项目内容
  .order-item {
    margin: 20rpx auto 20rpx auto;
    padding: 30rpx 30rpx;
    width: 94%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    background: #fff;
	
	.timeplus {
			display: flex;
			justify-content: flex-end;
			
			text {
				margin: 0 10rpx;
				font-size: 26rpx;
			}
	}
  }
  .line {
	  border-bottom: 1px solid #f3f3ee;
	  height:1px;
	  margin-bottom: 10px;
  }

  // 项目顶部
  .item-top {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;
    margin-bottom: 40rpx;
	border-bottom: 1px solid #f3f3ee;
	padding-bottom: 14rpx;

    .order-time {
      color: black;
	  font-weight: bold;
	  
	  
    }

    .state-text {
      color: $uni-text-color-active;
    }
  }

  // 商品列表
  .goods-list {

    // 商品项
    .goods-item {
      display: flex;
      margin-bottom: 40rpx;

      // 商品图片
      .goods-image {
        width: 180rpx;
        height: 180rpx;

        .image {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
        }
      }

      // 商品内容
      .goods-content {
        flex: 1;
        padding-left: 16rpx;
        padding-top: 16rpx;

        .goods-title {
          font-size: 26rpx;
          max-height: 76rpx;
        }

        .goods-props {
          margin-top: 14rpx;
          color: #ababab;
          font-size: 24rpx;
          overflow: hidden;

          .goods-props-item {
            display: inline-block;
            margin-right: 14rpx;
            padding: 4rpx 0rpx;
            border-radius: 12rpx;
            width: auto;
			
			text {
				display: block;
				padding: 4rpx 0rpx;
			}
          }
        }


      }

      // 交易信息
      .goods-trade {
        padding-top: 16rpx;
        width: 150rpx;
        text-align: right;
        color: $uni-text-color-grey;
        font-size: 26rpx;

        .goods-price {
          vertical-align: bottom;
          margin-bottom: 16rpx;

          .unit {
            margin-right: -2rpx;
            font-size: 24rpx;
          }
        }
      }

    }

  }

  // 订单合计
  .order-total {
    font-size: 26rpx;
    vertical-align: bottom;
    text-align: right;
    height: 40rpx;
    margin-bottom: 30rpx;

    .unit {
      margin-left: 8rpx;
      margin-right: -2rpx;
      font-size: 26rpx;
    }

    .money {
      font-size: 28rpx;
    }
  }

  // 订单操作
  .order-handle {
    .btn-group {

      .btn-item {
        border-radius: 10rpx;
        padding: 6rpx 20rpx;
        margin-left: 15rpx;
        font-size: 28rpx;
        float: right;
        color: #383838;
        border: 1rpx solid #a8a8a8;

        &:last-child {
          margin-left: 0;
        }

        &.active {
          color: $uni-text-color-active;
          border: 1rpx solid $uni-text-color-active;
        }
      }

    }

  }

  // 弹出层-支付方式
  .pay-popup {
    padding: 24rpx;

    .title {
      font-size: 44rpx;
      margin-bottom: 40rpx;
      font-weight: bold;
      text-align: center;
    }

    .pop-content {
      min-height: 290rpx;
      padding: 0 10rpx;

      .pay-item {
        padding: 24rpx 35rpx;
        font-size: 60rpx;
        border-bottom: 1rpx solid #f1f1f1;

        &:last-child {
          border-bottom: none;
        }

        .item-left_icon {
          margin-right: 20rpx;
          font-size: 96rpx;

          &.wechat {
            color: #00c800;
          }

          &.balance {
            color: #ff9700;
          }
        }
      }
    }
  }
</style>
