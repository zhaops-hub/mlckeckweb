import request from '@/utils/request'
import Common from '../utils/common'
const helper = Common.helper

export async function getOrganizations(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Orgs/GetOrganizations',
    method: 'post',
    data: data
  })
}

export async function editOrganizations(data) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Orgs/AddOrganization',
    method: 'post',
    data: data
  })
}

export async function getOrganizationsByid(id) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Orgs/GetOrganizationById?organizationId=' + id,
    method: 'get'
  })
}

export async function getOrganizationsTree() {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Orgs/GetOrganizationsTree',
    method: 'post'
  })
}

export async function deleteOrganizationsTree(id) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Orgs/DeleteOrganization?id=' + id,
    method: 'get'
  })
}


export async function getAreasByName(name) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Area/GetAreasByName?name=' + name,
    method: 'get'
  })
}


export async function getAreasByCode(code) {
  const url = await helper.getUmsUrl()
  return request({
    url: url + '/api/Area/GetAreasByCode?code=' + code,
    method: 'get'
  })
}



