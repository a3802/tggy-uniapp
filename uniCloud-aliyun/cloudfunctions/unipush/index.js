'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__88811EE"})
exports.main = async (event, context) => {
	let obj = JSON.parse(event.body);  
    return await uniPush.sendMessage({  
        //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
        "push_clientid": obj.clientid,     
        "force_notification":true,  //填写true，客户端就会自动创建“通知栏消息”。  
        "title": obj.title,      
        "content": obj.content,  
        "payload": obj.payload,
		"request_id": obj.request_id
    }) 
};
