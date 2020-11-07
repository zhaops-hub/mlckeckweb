import request from '@/utils/request'
import Common from '../utils/common'
const helper = Common.helper

export async function getServers(where) {
    const url = await helper.getUmsUrl()
    return request({
        url: url + '/api/Server/GetServers',
        method: 'post',
        data: where
    })
}

export async function addServer(data) {
    const url = await helper.getUmsUrl()
    return request({
        url: url + '/api/Server/addServer',
        method: 'post',
        data: data
    })
}


export async function getServerById(data) {
    const url = await helper.getUmsUrl()
    return request({
        url: url + '/api/Server/GetServerById',
        method: 'get',
        params: data
    })
}

export async function existServerName(data) {
    const url = await helper.getUmsUrl()
    return request({
        url: url + '/api/Server/ExistServerName',
        method: 'get',
        params: data
    })
}

export async function deleteServer(data) {
    const url = await helper.getUmsUrl()
    return request({
        url: url + '/api/Server/DeleteServer',
        method: 'get',
        params: data
    })
}