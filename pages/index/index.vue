<template>
  <view class="container">
    <!-- 店铺页面组件 -->
    <Page :items="items" />
	<!-- 优惠卷弹窗 -->
	<u-modal v-model="showPoints"  title="优惠卷说明">
	  <scroll-view class="points-content" :scroll-y="true" style="height:108px;">
	    <text>
			<h3>优惠卷已经发送到个人账户中心</h3>
			<h3>请使用注册时填写的手机号进行登录</h3>
			<h3>期待您的使用</h3>
		</text>
	  </scroll-view>
	</u-modal>
	
  </view>
</template>

<script>
  import * as Api from '@/api/page'
  import Page from '@/components/page'

  const App = getApp()

  export default {
    components: {
      Page
    },
    data() {
      return {
        // 页面参数
        options: {},
        // 页面属性
        page: {},
		// 是否显示优惠卷说明
		showPoints: false,
        // 页面元素
        items: [],
		// ios 过审开关
		iosType: false
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // 当前页面参数
      this.options = options
      // 加载页面数据
	  this.onRefreshPage()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    methods: {
		
		// 刷新页面数据
		onRefreshPage() {
		  const app = this
		  Promise.all([app.getPageData()])
		},

      /**
       * 加载页面数据
       * @param {Object} callback
       */
      getPageData(callback) {
        const app = this
        const pageId = app.options.pageId || 0
		Api.setting()
			.then(result => { //ios过审方法,返回由后台控制
				// console.log(result)
				if(result.data.tabar){
					uni.setTabBarItem({
						index: 1,
						visible: false,
					})
					app.iosType = true;
				}
			}).finally(() => callback && callback())	
				
        Api.detail(pageId)
          .then(result => {
            // 设置页面数据
            const { data: { pageData } } = result
            app.page = pageData.page
            app.items = pageData.items
			if(app.iosType){
				app.items.splice(1,1); //清除所有因为ios过审失败的因素,ios不能允许售卖第三方虚拟产品,所以后台开关关闭
			}
            // 设置顶部导航栏栏
            app.setPageBar();
          })
          .finally(() => callback && callback())

      },
	   

      /**
       * 设置顶部导航栏
       */
      setPageBar() {
        const {
          page
        } = this
        // 设置页面标题
        uni.setNavigationBarTitle({
          title: page.params.title
        });
        // 设置navbar标题、颜色
        uni.setNavigationBarColor({
          frontColor: page.style.titleTextColor === 'white' ? '#ffffff' : '#000000',
          backgroundColor: page.style.titleBackgroundColor
        })
      },
	  
    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh() {
      // 获取首页数据
      this.getPageData(() => {
        uni.stopPullDownRefresh()
      })
    },

  }
</script>

<style lang="scss" scoped>
  .container {
    background: #fff;
  }
  
  // 积分说明
  .points-content {
    padding: 30rpx 48rpx;
    font-size: 28rpx;
    line-height: 50rpx;
    text-align: left;
    color: #606266;
    height: 620rpx;
    box-sizing: border-box;
  }
</style>
