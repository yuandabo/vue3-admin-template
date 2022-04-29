// 上传文件
import request from '@/utils/request'

export function uploadF (data) {
  return request({
    url: '/api/admin/store-rent/upload',
    method: 'post',
    data
  })
}
