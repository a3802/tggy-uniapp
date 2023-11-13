import request from '@/utils/request'

// api地址
const api = {
  detail: 'Subscribe/detail',
}


// 商品详情
export const detail = (subId, page) => {
  return request.get(api.detail, { subId, page })
}

