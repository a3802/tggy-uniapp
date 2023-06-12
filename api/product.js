import request from '@/utils/request'

// api地址
const api = {
  list: 'product/list',
  detail: 'product/detail',
}

// 商品列表
export const list = param => {
  return request.get(api.list, param)
}

// 商品详情
export const detail = categoryId => {
  return request.get(api.detail, { categoryId })
}
