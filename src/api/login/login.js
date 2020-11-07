import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function uploadPublicKey(data) {
  return request({
    url: '/api/License/UploadPublicKey',
    method: 'post',
    data
  })
}

export function uploadLicense(data) {
  return request({
    url: '/api/License/UploadLicense',
    method: 'post',
    data
  })
}
