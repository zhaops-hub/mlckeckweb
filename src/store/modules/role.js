import { getRoles, addRole } from '@/api/role'



const actions = {
    getRoles({ }, data) {
        return new Promise((resolve, reject) => {
            getRoles(data).then(response => {
                const data = response
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addRole({ }, data) {
        return new Promise((resolve, reject) => {
            addRole(data).then(response => {
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
