import axios from 'axios'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
import {
  Message
} from 'element-ui'

// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers['api-version'] = '1.0'
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = '' + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error.response.data.error_description)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    return res
  },
  error => {
    // eslint-disable-next-line no-console
    if (!error.response) {
      Message({
        message: '网络连接异常！',
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error.response.data)
  }
)

export default service
