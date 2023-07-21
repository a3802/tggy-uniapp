<template>
  <view class="container">
    <!-- 订单页列表 -->
    <view class="order-list">
      <view class="order-item"  @click="handleService({url:'pages/setting/about'})">
        <view class="order-item-name">关于我们</view>
        <view class="icon-arrow">
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="order-item"  @click="handleService({url:'pages/setting/user'})">
        <view class="order-item-name">用户协议</view>
        <view class="icon-arrow">
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
      <view class="order-item"  @click="handleService({url:'pages/setting/secret'})">
        <view class="order-item-name">隐私协议</view>
        <view class="icon-arrow">
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			// 跳转到服务页面
			handleService({ url }) {
			  this.$navTo(url)
			},
		}

	}
</script>

<style lang="scss" scoped>
  .order-list {
    padding: 0 25rpx;
    background-color: #fff;

    .order-item {
      position: relative;
      padding: 26rpx 16rpx;
      border-bottom: 1rpx solid #eee;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 30rpx;

      &:last-child {
        border-bottom: none;
      }
    }

    .order-item-icon {
      font-size: 34rpx;
      margin-right: 18rpx;
    }

    .icon-arrow {
      position: absolute;
      top: 26rpx;
      right: 6rpx;
    }
  }

  // 底部操作栏
  .footer {
    position: fixed;
    bottom: var(--window-bottom);
    left: 0;
    right: 0;
    z-index: 11;
    box-shadow: 0 -4rpx 40rpx 0 rgba(151, 151, 151, 0.24);
    background: #fff;

    // 设置ios刘海屏底部横线安全区域
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    .btn-item {
      font-size: 30rpx;
      height: 90rpx;
      border-radius: 50rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-item-icon {
      font-size: 34rpx;
      margin-right: 18rpx;
    }

  }
</style>
