'use strict';
exports.main = async (event, context) => {
	try {
		const res = await uniCloud.sendSms({
			appid: '__UNI__88811EE',
			smsKey: '9ea997dba76319b49cba631fdf665576',
			smsSecret: 'c043ca40116643d615c1061804a68cd1',
			phone: '188********',
			templateId: '100**', // 请替换为自己申请的模板id
			data: {
				name: 'DCloud',
				code: '123456',
				expMinute: '3',
			}
		})
			// 调用成功，请注意这时不代表发送成功
			return res
			
		} catch(err) {
		// 调用失败
			console.log(err.errCode)
			console.log(err.errMsg)
			return {
			  code: err.errCode,
			  msg: err.errMsg
			}
	}
};
