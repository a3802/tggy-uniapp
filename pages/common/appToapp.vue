<template>
	<view class="container">
		<view class="transition_title">正在跳转拼多多APP</view>
		<view class="transition_content">
			<view class="transition_icon">
				<view class="transition_image">
					<image class="image" src="../../static/icon.png"></image>
				</view>
				<view class="transition_name">
					<text>口袋折扣APP</text>
				</view>
			</view>
			<view class="transition_left">
				<span></span>
				<span></span>
				<span></span>
			</view>
			<view class="transition_icon">
				<view class="transition_image">
					<image class="image" src="../../static/share_logo.jpg"></image>
				</view>
				<view class="transition_name">
					<text>拼多多APP</text>
				</view>
			</view>
		</view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		
		onLoad(item) {
			console.log(item);
		
			setTimeout(() => {
				
				if(this.checkApp()){
					let url = decodeURIComponent(item.schema_url);
						console.log(url);
						this.openClient(url)
				}else{
					this.url = decodeURIComponent(item.mini)	
				}
				
			}, 3000);// 传入需要跳转的链接 使用web-view标签进行跳转		
			

		},		
		
		methods: {
			
			//打开第三方客户端,有可能时app,或者小程序
			openClient(url){
				console.log(url);
				
				// 判断平台  
				if (plus.os.name == 'Android') {  
					plus.runtime.openURL(url, function(e) {  
							console.log('Open system default browser failed: ' + e.message);  
						}  
					);  
				} else if (plus.os.name == 'iOS') {  
					plus.runtime.launchApplication({ action: 'taobao://' }, function(e) {  
						console.log('Open system default browser failed: ' + e.message);  
					});  
				} 
			},
			
		  //判断手机是否安装了对应app
		   checkApp(){
			if(plus.runtime.isApplicationExist({pname:'com.xunmeng.pinduoduo',action:'pinduoduo://'})){
				console.log("应用已安装");
				return true;
			}else{
				console.log("应用未安装");
				return false;
			}
		  
		  },			
		

		},
	}
</script>

<style lang="scss" scoped>
	
  .container {
	height:100%;
    background: #fff;
	padding:80px 0px 400px 0px;
  }
  
  .transition_content{
	  display: flex;
	  justify-content: space-evenly;
  }
  .transition_title{
	  text-align: center;
	  line-height: 40px;
	  font-weight: 700;
	  font-size:36rpx;
	  height:100px;
  }
  
  .transition_name{
	  font-size:12px;
	  text-align: center;
  }
  
  .transition_image{
	  
	  margin:20px 0 10px 0;
	  
	  image {
		  width:160rpx;
		  height:160rpx;		  
	  }
  }
  
  .transition_left{
	  margin:50px 0;
  }
  
</style>
<style lang="scss">
	
  .transition_left {
		span:nth-child(1) {
			-webkit-animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
			animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
		}	
		span:nth-child(2) {
			-webkit-animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
			animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
		}
		span:nth-child(3) {
			-webkit-animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
			animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
		}				
  }

@keyframes scale {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
	
  .transition_left>span {
          background-color: #ebd3d3;
          width: 15px;
          height: 15px;
          border-radius: 100%;
          margin: 2px;
		  -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
          display: inline-block;
	}
	
</style>

