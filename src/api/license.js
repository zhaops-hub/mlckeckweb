import request from '@/utils/request'
import Common from '../utils/common'
const helper = Common.helper

export async function getSerialNumber() {
    const url = await helper.getUmsUrl()
    return request({
        url: url + '/api/License/GetSerialNumber',
        method: 'post'
    })
}



export async function getLicense() {
    const url = await helper.getUmsUrl()
    return request({
        url: url + '/api/License/GetLicense',
        method: 'get'
    })
}