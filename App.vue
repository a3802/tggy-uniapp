<script>
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

		uni.onPushMessage((msg)=>{

			if(msg.type=='receive'){
				uni.createPushMessage({
					title:msg.data.title,
					content:msg.data.content,
					payload:msg.data.payload,
					success:(res)=> {
						console.log(111111)
						console.log(res)
					},
					fail:(res)=>{
						console.log(222)
					}
				})
			}else{
				console.log(222222);
				console.log(msg.data.payload.page)
				if(msg.data.payload.page){
					// clearTimeout(timer);
					// timer = setTimeout(() => {
						console.log(msg.data.payload.page);
						if (msg.data.payload) {
							
							if(msg.data.payload.page=='/pages/product/cate'){
								uni.navigateTo({
									url : msg.data.payload.page + '?subId=' + msg.data.payload.id
								})
							}else if(msg.data.payload.page=='/pages/product/detail'){
								uni.navigateTo({
									url: msg.data.payload.page + '?categoryId=' + msg.data.payload.id
								})
							}else if(msg.data.payload.page=='/pages/goods/detail'){
								uni.navigateTo({
									url: msg.data.payload.page + '?goods_sign=' + msg.data.payload.id
								})								
							}
							
						}
					// }, 1500)
				}
			}
		})
 
		// uni.getPushClientId({  
		// 	success: (res) => {  
		// 	  let push_clientid = res.cid  
		// 	  console.log('客户端推送标识cid:',push_clientid)  
		// 	},  
		// 	fail(err) {  
		// 	  console.log(err)  
		// 	}  
		// })			  
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
