import store from '@/store'
import * as LoginApi from '@/api/login'

export const appUnilogin = () => {
	
	const univerifyManager = uni.getUniverifyManager()
	// 预登录
	univerifyManager.preLogin()
	// 调用一键登录弹框
	univerifyManager.login({
		univerifyStyle: {
			"fullScreen": true,
			"authButton": {
				"normalColor":'#ffb100'
			},
			"otherLoginButton": {
				"title": "其他手机号登录"
			},
			"privacyTerms": {  
				"defaultCheckBoxState":false, // 条款勾选框初始状态 默认值： true
				"isCenterHint":false, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
				"uncheckedImage":"", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)   
				"checkedImage":"", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)   
				"checkBoxSize":12, // 可选 条款勾选框大小
				"textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB  
				"termsColor": "#5496E3", //  协议文字颜色 默认值： #5496E3  
				"prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”  
				"suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”    
			}
		},
		success (res) {
			console.log(res);
			
			uniCloud.callFunction({
			  name: 'access_login', // 你的云函数名称
			  data: {
				'access_token': res.authResult.access_token, // 客户端一键登录接口返回的access_token
				'openid': res.authResult.openid // 客户端一键登录接口返回的openid
			  }
			}).then(res => {
				console.log(res);
				store.dispatch('QyLogin', {
					mobile: res.result.phoneNumber,
					isParty: false,
					partyData: {}
				  }).then(result => {
					
					if(result.status == 200){
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							mask: true,
							duration: 1500,
							success(res) {
							  uni.$emit('syncRefresh', true)
							}
						})							
						setTimeout(() => {
							uni.closeAuthView()
						},2000)
					
					}
				
				})
				.catch()
				.finally()			  
			  // 登录成功，可以关闭一键登录授权界面了
			}).catch(err=>{
				console.log(err);
			  // 处理错误
			  uni.closeAuthView() 
			})	
		},
		fail(res){  // 登录失败
			console.log(res);
			if(res.code !== 30003){
				uni.closeAuthView() 
				uni.navigateTo({
				  url: "/pages/login/index"
				})
				
			}else{
				uni.navigateBack()
			}
		}
	})
}	

