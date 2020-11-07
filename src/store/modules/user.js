import {
  login,
  logout,
  getInfo,
  getUsers,
  existAccount,
  addUser,
  getUserById,
  deleteUser,
  deleteUsers
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import router, {
  resetRouter
} from '@/router'
const md5 = require('md5')
import Common from '../../utils/common'
const helper = Common.helper

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise(async (resolve, reject) => {

      var data = {
        userName: username,
        password: md5(password),
        companyName: "admin"
      }

      // commit('SET_TOKEN', response.access_token)
      // setToken(response.access_token)
      // resolve()
      try {
        const response = await login(data)
        if (response.code == -1) {
          reject({
            error_description: response.msg
          })
        }

        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
        resolve()
      } catch (error) {
        reject(error)
      }

      // .then(response => {

      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(async response => {
        const data = response
        if (!data || data.code != 0) {
          reject('Verification failed, please Login again.')
        }

        const {
          userName
        } = data.data
        
       
        commit('SET_ROLES', 'admin')
        commit('SET_NAME', userName)
       // commit('SET_AVATAR', serviceUrl + "")
        commit('SET_INTRODUCTION', '')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getusers

  getUsers({ }, where) {
    return new Promise((resolve, reject) => {
      getUsers(where).then(response => {
        const data = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // getuserById

  getUserById({ }, where) {
    return new Promise((resolve, reject) => {
      getUserById(where).then(response => {
        const data = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // existAccount

  existAccount({ }, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await existAccount(data)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  },

  // addUser

  addUser({ }, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await addUser(data)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  },

  // deleteuser

  deleteUser({ }, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await deleteUser(data)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  },


  deleteUsers({ }, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await deleteUsers(data)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       commit('SET_TOKEN', '')
  //       removeToken()
  //       resetRouter()
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({
    commit,
    dispatch
  }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const {
        roles
      } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, {
        root: true
      })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, {
        root: true
      })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
