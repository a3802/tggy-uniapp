<template>
  <!-- 店铺公告 -->
  <view class="diy-notice" :style="{ paddingTop: `${itemStyle.paddingTop}px`, paddingBottom: `${itemStyle.paddingTop}px` }"
    @click="onLink(params.link)">
	<view class="notice_text">充值信息</view>
    <u-notice-bar padding="10rpx 24rpx" :volume-icon="params.showIcon" :autoplay="params.scrollable"
      :bg-color="itemStyle.background" :color="itemStyle.textColor" :list="params.text" style="padding-left: 10px;"></u-notice-bar>
  </view>
</template>

<script>
  import mixin from '../mixin'

  export default {

    /**
     * 组件的属性列表
     * 用于组件自定义设置
     */
    props: {
      itemStyle: Object,
      params: Object
    },

    mixins: [mixin],

    /**
     * 组件的方法列表
     * 更新属性和数据的方法与更新页面数据的方法类似
     */
    methods: {
		

    }

  }
</script>

<style lang="scss" scoped>
.notice_text{
		float: left;
	    line-height: 28px;
	    padding-left: 13px;
	    font-size: 16px;
	    font-weight: bold;
	    font-style: oblique;
	    background: linear-gradient(to right, #e5601ee3, #d1d150);
	    -webkit-background-clip: text;
	    -webkit-text-fill-color: transparent;
}
</style>
