import { getServers, addServer, getServerById, existServerName, deleteServer } from '@/api/server'



const actions = {
    getServers({ }, data) {
        return new Promise((resolve, reject) => {
            getServers(data).then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addServer({ }, data) {
        return new Promise((resolve, reject) => {
            addServer(data).then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getServerById({ }, where) {
        return new Promise((resolve, reject) => {
            getServerById(where).then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    existServerName({ }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await existServerName(data)
                resolve(response)
            }
            catch (error) {
                reject(error)
            }
        })
    },
    deleteServer({ }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await deleteServer(data)
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
