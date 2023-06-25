import request from '@/utils/request'

// api地址
const api = {
  todoCounts: 'order/todoCounts',
  list: 'product/list',
  detail: 'product/detail',
  submit: 'product/submit',
  orderlist: 'product/orderlist'
}

// 商品列表
export const list = param => {
  return request.get(api.list, param)
}

// 商品详情
export const detail = categoryId => {
  return request.get(api.detail, { categoryId })
}


//权益商品提交
export const submit = (mode, data) => {
  return request.post(api.submit, { mode, ...data })
}


// 当前用户待处理的订单数量
export function todoCounts(param, option) {
  return request.get(api.todoCounts, param, option)
}

// 我的权益商品订单列表
export function orderlist(param, option) {
  return request.get(api.orderlist, param, option)
}
