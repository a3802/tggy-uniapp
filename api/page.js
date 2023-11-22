import request from '@/utils/request'

// api地址
const apiUri = {
  detail: 'page/detail',
  ios: 'judgeTab/change'
}

// 页面数据
export function detail(pageId) {
  return request.get(apiUri.detail, {
    pageId
  })
}


// ios设置方便过审
export function setting() {
  return request.get(apiUri.ios, {})
}
