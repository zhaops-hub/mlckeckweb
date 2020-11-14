<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="conditionJson.userName"
        placeholder="账号"
        style="width: 200px"
        class="filter-item"
      />
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="addUser">添加</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="公司名"
        prop="companyName"
        width="*"
        align="center"
      />
      <el-table-column label="账号" prop="userName" width="*" align="center" />
      <el-table-column
        label="是否超级管理"
        prop="isAdmin"
        width="*"
        align="center"
      >
        <template slot-scope="{ row }">
          <span v-if="row.isAdmin == 1">是</span>
          <span v-if="row.isAdmin != 1">否</span>
        </template>
      </el-table-column>

      <el-table-column
        label="是否禁用"
        prop="isDelete"
        width="*"
        align="center"
      >
        <template slot-scope="{ row }">
          <span v-if="row.isDelete == 1">是</span>
          <span v-if="row.isDelete != 1">否</span>
        </template>
      </el-table-column>
      <el-table-column
        label="过期时间"
        prop="expired"
        width="*"
        align="center"
      />
      <el-table-column
        label="最后登录时间"
        prop="lastLoginTime"
        width="*"
        align="center"
      >
        <template slot-scope="{ row }">
          <span v-if="row.lastLoginTime">{{ row.lastLoginTime }}</span>
          <span v-if="!row.lastLoginTime">无</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="160px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <div v-if="row.isAdmin != 1">
            <el-button type="primary" size="mini" @click="handleUpdate(row)"
              >修改</el-button
            >
            <el-button
              type="primary"
              v-if="row.isDelete == 0"
              size="mini"
              @click="deleteUser(row)"
              >禁用</el-button
            >

            <el-button
              type="primary"
              v-if="row.isDelete == 1"
              size="mini"
              @click="deleteUser(row)"
              >启用</el-button
            >
          </div>
          <span v-if="row.isAdmin == 1">不可操作</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      align="center"
      layout="prev, pager, next"
      :page-count="total"
      :current-page.sync="conditionJson.page"
      @current-change="getList"
    />

    <div v-if="dialogVisible">
      <AddUser
        :id="id"
        :dialog-visible="dialogVisible"
        @close-addUser="closeAddUser"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'
import { deleteUser, resume } from '../../api/user'
import { parseGender, parseTime } from '@/utils'
import AddUser from './components/addUser'

export default {
  name: 'UserList',
  components: { Pagination, AddUser },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      tableKey: 'userstable',
      dialogVisible: false,
      listLoading: true,
      list: [],
      conditionJson: {
        userName: '',
        page: 1,
        rows: 10,
      },
      total: 0,
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
    closeAddUser() {
      this.dialogVisible = false
      this.getList()
    },
    async getList() {
      this.listLoading = true
      const { code, data, pages } = await this.$store.dispatch(
        'user/getUsers',
        this.conditionJson
      )
      this.listLoading = false
      if (code != 0) {
        Message({
          message: '查询失败',
          type: 'error',
          duration: 5 * 1000,
        })
      } else {
        this.list = data
        this.total = pages
      }
    },
    addUser() {
      this.dialogVisible = true
      this.id = ''
    },
    async deleteUser(row) {
      var confirmMsg = '禁用'
      if (row.isDelete == 1) confirmMsg = '启用'
      try {
        const conf = await this.$confirm(
          '确定要' + confirmMsg + ', 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )

        if (confirm == undefined) return
        if (row.isDelete == 0) {
          const { code, msg } = await deleteUser(row.id)
          if (code == 0) {
            this.getList()
          } else {
            this.$message.error(msg)
          }
        } else {
          const { code, msg } = await resume(row.id)
          if (code == 0) {
            this.getList()
          } else {
            this.$message.error(msg)
          }
        }
      } catch {
        // 取消
      }
    },
  },
}
</script>
