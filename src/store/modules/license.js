import { getSerialNumber, getLicense } from '@/api/license'



const actions = {
    getSerialNumber({ }) {
        return new Promise((resolve, reject) => {
            getSerialNumber().then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getLicense({ }) {
        return new Promise((resolve, reject) => {
            getLicense().then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    actions
}
