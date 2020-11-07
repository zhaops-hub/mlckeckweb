<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container">
        <el-input
          v-model="conditionJson.clientId"
          placeholder="客户端Id"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="addClient">添加</el-button>
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
      <el-table-column label="客户端ID" prop="clientId" width="*" align="center"/>
      <el-table-column label="授权方式" prop="allowedGrantTypes" width="*" align="center"/>
      <el-table-column
        label="访问令牌过期时间"
        :formatter="parseAccessTokenLifetime"
        prop="accessTokenLifetime"
        width="*"
        align="center"
      />
      <el-table-column label="包含资源" prop="allowedScopes" width="*" align="center">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.allowedScopes" :key="index" v-if="item!='openid' && item!='profile' && item!='custom.profile'" disable-transitions>{{item}}</el-tag>
        </template>
      </el-table-column>``
      <el-table-column label="操作" align="center" width="*" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button type="primary" size="mini" @click="deleteClient(row)">删除</el-button>
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
      <AddClient :id="id" :dialogVisible="dialogVisible" @close-addClient="closeClient"></AddClient>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'
import { parseGender, parseTime, timeStamp } from '@/utils'
import AddClient from './components/addClient'
export default {
  name: 'ServerList',
  components: { Pagination,AddClient },
  data() {
    return {
      index: null,
      id: '',
      dialogVisible: false,
      listLoading: false,
      list: [],
      listQuery: {
        page: 1,
        rows: 10
      },
      conditionJson: {
        clientId: ''
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
        'client/getClients',
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
    closeClient() {
      this.dialogVisible = false
      this.getList()
    },
    addClient() {
      this.id = ''
      this.dialogVisible = true
    },
    parseAccessTokenLifetime(row, col) {
      return timeStamp(row.accessTokenLifetime).time
    },
    async deleteClient(row) {
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
        const res = await this.$store.dispatch('client/deleteClient', {
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