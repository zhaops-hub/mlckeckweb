<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container">
        <el-input
          v-model="conditionJson.name"
          placeholder="key"
          style="width: 200px;"
          class="filter-item"
        />
        <el-input
          v-model="conditionJson.displayName"
          placeholder="服务名称"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="addServer">添加</el-button>
      </div>
    </div>

    <el-table
      :data="list"
      style="width: 100%"
      border
      fit
      highlight-current-row
      v-loading="listLoading"
    >
      <el-table-column label="服务key" prop="name" width="*" align="center"/>
      <el-table-column label="服务名称" prop="displayName" width="*" align="center"/>
      <el-table-column label="备注" prop="description" width="*" align="center"/>
      <el-table-column label="操作" align="center" width="*" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button type="primary" size="mini" @click="deleteServer(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      align="center"
      layout="prev, pager, next"
      :page-count="total"
      :current-page.sync="listQuery.page"
      @current-change="getList"
    ></el-pagination>

    <div v-if="dialogVisible">
      <AddServer :id="id" :dialogVisible="dialogVisible" @close-addServer="closeServer"></AddServer>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'
import { parseGender, parseTime } from '@/utils'
import AddServer from './components/addServer'

export default {
  name: 'ServerList',
  components: { Pagination, AddServer },
  data() {
    return {
      id: '',
      dialogVisible: false,
      listLoading: false,
      list: [],
      listQuery: {
        page: 1,
        rows: 10
      },
      conditionJson: {
        name: '',
        displayName: ''
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleUpdate(row) {
      this.id = row.id
      this.dialogVisible = true
    },
    async getList() {
      this.listLoading = true
      this.listQuery.conditionJson = JSON.stringify(this.conditionJson)
      const res = await this.$store.dispatch(
        'server/getServers',
        this.listQuery
      )
      if (res.code == 0) {
        this.listLoading = false
        this.list = res.result
        this.total = res.total
      } else {
        Message({
          message: '查询失败',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    closeServer() {
      this.dialogVisible = false
      this.getList()
    },
    addServer() {
      this.id = ''
      this.dialogVisible = true
    },
    async deleteServer(row) {
      try {
        const conf = await this.$confirm(
          '此操作将永久删除该文件, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )

        if (confirm == undefined) return
        const res = await this.$store.dispatch('server/deleteServer', {
          id: row.id
        })

        if (res.code == 0) {
          this.getList()
        } else {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      } catch {
        //取消
      }
    }
  }
}
</script>