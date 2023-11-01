'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__88811EE"})
exports.main = async (event, context) => {
    return await uniPush.sendMessage({  
        //填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
        "push_clientid": "自己的设备号",     
        "force_notification":true,  //填写true，客户端就会自动创建“通知栏消息”。  
        "title": "您收到一条消息",      
        "content": "请查看",  
        "payload": {  
            "text":"体验一下uni-push2.0"  
        }  
    }) 
};
