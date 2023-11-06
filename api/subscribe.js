import request from '@/utils/request'

// api地址
const api = {
  detail: 'Subscribe/detail',
}


// 商品详情
export const detail = subId => {
  return request.get(api.detail, { subId })
}

