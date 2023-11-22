<script>
  import store from './store'
  import { userTabbar, adminTabbar } from './utils/tabbar.js'
  export default {
    /**
     * 全局变量
     */
    globalData: {
    },

    /**
     * 初始化完成时触发
     */
    onLaunch() {
      // 小程序主动更新
      this.updateManager()
	  
	  this.changeBar()
    },

    methods: {

      /**
       * 小程序主动更新
       */
      updateManager() {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(res => {
          // 请求完新版本信息的回调
          // console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(() => {
          uni.showModal({
            title: '更新提示',
            content: '新版本已经准备好，即将重启应用',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        updateManager.onUpdateFailed(() => {
          // 新的版本下载失败
          uni.showModal({
            title: '更新提示',
            content: '新版本下载失败',
            showCancel: false
          })
        })
      },
	
	//请求后台判断是否开启动态修改tabbar，为了过审
	changeBar(){
		uni.request({
			url:'https://api-tgqy.yueyueyouqian.cn/api/judgeTab/change',
			method:'GET',
			header:{},
			success:(res)=>{
				console.log('数据',res)
				// console.log(store);
				
				if(res.data.data.tabar){
					console.log(11111);
					// this.$store.dispatch('changeTabbar', adminTabbar)
					// uni.hideTabBar({
					// 	index:1
					// })

				uni.setTabBarItem({
					index: 1,
					text: '发现',
				})

				}else{
					this.$store.dispatch('changeTabbar', userTabbar)
				}
			}
		})	
	}

    }

  }
</script>

<style lang="scss">
  /* 引入uView库样式 */
  @import "uview-ui/index.scss";
</style>

<style>
  /* 项目基础样式 */
  @import "./app.scss";

  .uni-app--showlayout+uni-tabbar.uni-tabbar-bottom,
  .uni-app--showlayout+uni-tabbar.uni-tabbar-bottom .uni-tabbar,
  .uni-app--showlayout+uni-tabbar.uni-tabbar-top,
  .uni-app--showlayout+uni-tabbar.uni-tabbar-top .uni-tabbar {
    left: var(--window-left);
    right: var(--window-right);
  }

</style>
