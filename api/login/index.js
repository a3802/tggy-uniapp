import request from '@/utils/request'

// api地址
const api = {
  login: 'passport/login',
  loginMpWx: 'passport/loginMpWx',
  loginMpWxMobile: 'passport/loginMpWxMobile',
  unilogin: 'equity/qyLogin',
  logOff: 'user/logOff'
}

// 用户登录(手机号+验证码)
export function login(data) {
  return request.post(api.login, data)
}

// 一键登录(手机号)
export function unilogin(data) {
  return request.post(api.unilogin, data)
}

// 微信小程序快捷登录(获取微信用户基本信息)
export function loginMpWx(data, option) {
  return request.post(api.loginMpWx, data, option)
}

// 微信小程序快捷登录(授权手机号)
export function loginMpWxMobile(data, option) {
  return request.post(api.loginMpWxMobile, data, option)
}


// 注销用户
export const logOff = (userId) =>  {
  return request.post(api.logOff, {userId})
}
