<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>服务器信息</span>
      </div>
      <div class="text item">服务器序列号: {{serialNumber}}</div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>授权信息</span>
      </div>
      <div class="text item">序列号: {{licenseData.serialNumber}}</div>
      <div class="text item">到期时间: {{licenseData.expiration}}</div>

      <el-table border :data="licenseData.modules" style="width: 100%">
        <el-table-column prop="moduleId" align="center"  label="包含的模块Id" ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { parseGender, parseTime } from '@/utils'

export default {
  name: 'UserList',
  components: {},
  data() {
    return {
      serialNumber: '',
      licenseData: {
        serialNumber: '',
        expiration: '',
        modules: []
      }
    }
  },
  created() {
    this.getSerialNumber()
    this.getLicense()
  },
  methods: {
    async getSerialNumber() {
      const res = await this.$store.dispatch('license/getSerialNumber')
      if (res.code == 0) {
        this.serialNumber = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    async getLicense() {
      const res = await this.$store.dispatch('license/getLicense')
      if (res.code == 0) {
        this.licenseData = res.data
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
  margin: 3% 0 0 20%;
}
</style>