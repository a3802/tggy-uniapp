import request from '@/utils/request'

// api地址
const api = {
  favorite: 'favorite/addFavorite',
  detail: 'favorite/getFavorite',
  list: 'favorite/list'
}


// 商品详情
export const detail = (user_id,goods_sign) => {
  return request.get(api.detail, { user_id,goods_sign })
}

// 收藏和取消收藏
export const favorite = (user_id, goods_sign,is_favorite) => {
  return request.post(api.favorite, { user_id, goods_sign,is_favorite })
}

// 商品详情
export const list = (user_id,page) => {
  return request.get(api.list, { user_id,page })
}