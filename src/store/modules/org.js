import { getOrganizations } from '@/api/org'

const actions = {
  getOrganizations({ }, data) {
    return new Promise((resolve, reject) => {
      getOrganizations(data).then(response => {
        const data = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  actions
}
