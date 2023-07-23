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
			  // 处理错误
			  uni.closeAuthView() 
			})	
		},
		fail(res){  // 登录失败
			console.log(res);
			if(res.code !== 30003){
				uni.navigateTo({
				  url: "/pages/login/index"
				})						
			}else{
				uni.navigateBack()
			}
		}
	})
}	

