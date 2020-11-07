import request from '@/utils/request'
import Common from '../utils/common'
const helper = Common.helper

export async function getRoles(where) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Role/GetRoles',
    method: 'post',
    data: where
  })
}

// 添加
export async function addRole(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Role/addRole',
    method: 'post',
    data: data
  })
}

// 通过id查找
export async function getRolebyId(id) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Role/GetRoleById?roleId=' + id,
    method: 'get'
  })
}

// 通过id删除
export async function deleteRolebyId(id) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Role/DeleteRole?id=' + id,
    method: 'get'
  })
}
