import request from '@/utils/request'
import Common from '../utils/common'
const helper = Common.helper

export async function login(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users/adminLogin',
    method: 'post',
    data
  })
}

export async function getInfo() {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users/userinfo',
    method: 'get'
  })
}

export async function getUser(id) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users/getUser/' + id,
    method: 'get'
  })
}

export async function addUser(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users/add',
    method: 'Post',
    data
  })
}

export async function getUserById(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/User/GetUserById',
    method: 'get',
    params: data
  })
}

export async function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export async function getUsers(where) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users',
    method: 'get',
    params: where
  })
}

export async function existAccount(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users/existUserName/' + data,
    method: 'get'
  })
}


export async function deleteUser(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users/' + data,
    method: 'DELETE'
  })
}

export async function resume(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/users/resume/' + data,
    method: 'get'
  })
}