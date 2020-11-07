import { getClients, addClient, getClientById, existClientId, deleteClient } from '@/api/client'

const actions = {
    getClients({ }, data) {
        return new Promise((resolve, reject) => {
            getClients(data).then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addClient({ }, data) {
        return new Promise((resolve, reject) => {
            addClient(data).then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getClientById({ }, where) {
        return new Promise((resolve, reject) => {
            getClientById(where).then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    existClientId({ }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await existClientId(data)
                resolve(response)
            }
            catch (error) {
                reject(error)
            }
        })
    },
    deleteClient({ }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await deleteClient(data)
                resolve(response)
            }
            catch (error) {
                reject(error)
            }
        })
    }
}

export default {
    namespaced: true,
    actions
}
