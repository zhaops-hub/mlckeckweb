import request from '@/utils/request'
import Common from '../utils/common'
const helper = Common.helper

export async function getClients(where) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Client/GetClients',
    method: 'post',
    data: where
  })
}

export async function addClient(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Client/addClient',
    method: 'post',
    data: data
  })
}

export async function getClientById(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Client/GetClientById',
    method: 'get',
    params: data
  })
}

export async function existClientId(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Client/ExistClientId',
    method: 'get',
    params: data
  })
}

export async function deleteClient(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Client/DeleteClient',
    method: 'get',
    params: data
  })
}
