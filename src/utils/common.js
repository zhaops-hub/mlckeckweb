import { Loading } from 'element-ui'
import { getConfig } from '@/api/common/config'
const helper = {
  fullscreenLoading() {
    return Loading.service({
      lock: true,
      text: '正在加载配置文件',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  },
  async getUmsUrl() {
    const url = await getConfig()
    return url.serviceUrl
  }
}

export default {
  helper
}
