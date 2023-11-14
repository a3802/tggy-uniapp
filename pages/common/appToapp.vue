<template>
	<view class="container">
		<view class="transition_title">正在跳转{{title}}</view>
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
					<image class="image" :src="image_url"></image>
				</view>
				<view class="transition_name">
					<text>{{sub_title}}</text>
				</view>
			</view>
		</view>
		<!-- <web-view :src="url"></web-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				platform: {
					pdd :{
						name:'拼多多APP',
						image_app: 'https://image.hrzhuolin.com/10001/20231111/5835560c12f4f53939bf06e3db3f7af3.png',
						image_weixin: 'https://image.hrzhuolin.com/10001/20231110/3eac0d6db4d73c03f465510d17be0ea6.png',
						pname: 'com.xunmeng.pinduoduo',
						action: 'pinduoduo://',
						sub_name: '微信-拼多多小程序'
					}
				},
				plat: {},
				title: '',
				image_url: '',
				sub_title: ''
				
			}
		},
		
		onLoad(item) {
			console.log(item);
			const app = this;
			const plat = app.platform[item.plat];
			// console.log(plat);
			if(app.checkApp(plat)){
				
				app.title = plat.name
				app.image_url = plat.image_app
				app.sub_title = plat.name
				let url = decodeURIComponent(item.schema_url);
				app.openClient(url,plat)
				
			}else{
				
				app.title = plat.sub_name
				app.image_url = plat.image_weixin
				app.sub_title = plat.sub_name
				app.openWx(item.short_url);						
			}			
			
			

		},		
		
		methods: {
			
			//打开第三方客户端,有可能时app,或者小程序
			openClient(url,obj){
				console.log(url);
				setTimeout(() => {
					// 判断平台  
					if (plus.os.name == 'Android') {  
						plus.runtime.openURL(url, function(e) {  
								console.log('Open system default browser failed: ' + e.message);  
							}  
						);  
					} else if (plus.os.name == 'iOS') {  
						plus.runtime.launchApplication({ action: obj.action }, function(e) {  
							console.log('Open system default browser failed: ' + e.message);  
						});  
					}
				},2000);
			},
			
			
			//跳转微信小程序
			openWx(url){

				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/common/webview?url=' + url
					}) 	
				},2000)
			},
			
		  //判断手机是否安装了对应app
		   checkApp(obj){
			   // return true;
			if(plus.runtime.isApplicationExist({pname:obj.pname,action:obj.action})){
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
	padding:80px 0px 800px 0px;
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
	  padding:0 20px;
	  
	  image {
		  width:120rpx;
		  height:120rpx;		  
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

