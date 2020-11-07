import request from '@/utils/request'

export function getConfig() {
  return request({
    url: 'config.json',
    method: 'get'
  })
}
