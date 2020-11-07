<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="conditionJson.account"
        placeholder="账号"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button type="primary" @click="getList">查询</el-button>
      <el-button type="primary" @click="addUser">添加</el-button>
      <el-button type="primary" @click="deleteUsers">批量删除</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="账号" prop="account" width="*" align="center" />
      <el-table-column label="真实姓名" prop="realName" width="*" align="center" />
      <el-table-column label="性别" prop="gender" width="*" :formatter="parseGender" align="center" />
      <el-table-column label="权限" prop="mobile" :formatter="parseRoles" width="*" align="center" />
      <el-table-column label="组织机构" prop="mobile" :formatter="parseOrg" width="*" align="center" />
      <el-table-column label="电话" prop="mobile" width="*" align="center" />
      <el-table-column label="邮箱" prop="email" width="*" align="center" />
      <el-table-column
        label="创建日期"
        prop="createDateTime"
        width="*"
        :formatter="parseTime"
        align="center"
      />

      <el-table-column
        label="操作"
        align="center"
        width="160px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button type="primary" size="mini" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      align="center"
      layout="prev, pager, next"
      :page-count="total"
      :current-page.sync="listQuery.page"
      @current-change="getList"
    />
    <div v-if="dialogVisible">
      <AddUser :id="id" :dialog-visible="dialogVisible" @close-addUser="closeAddUser" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'
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
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      userSelection: [],
      id: '',
      tableKey: 'usertable',
      listLoading: true,
      dialogVisible: false,
      list: [],
      listQuery: {
        page: 1,
        rows: 10
      },
      conditionJson: {
        account: ''
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
    async deleteUsers() {
      if (this.userSelection.length == 0) return
      let ids = []
      for (const i in this.userSelection) {
        ids.push(this.userSelection[i].id)
      }

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

        const res = await this.$store.dispatch('user/deleteUsers', ids)

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
        // 取消
      }
    },
    async deleteUser(row) {
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

        const res = await this.$store.dispatch('user/deleteUser', {
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
        // 取消
      }
    },
    closeAddUser() {
      this.dialogVisible = false
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.listQuery.conditionJson = JSON.stringify(this.conditionJson)
      this.$store
        .dispatch('user/getUsers', this.listQuery)
        .then(data => {
          this.listLoading = false
          if (data.code === 0) {
            this.list = data.result
            this.total = data.total
          } else {
            Message({
              message: '查询失败',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
        .catch(error => {})
    },
    addUser() {
      this.dialogVisible = true
      this.id = ''
    },
    parseGender(row, col) {
      return parseGender(row.gender)
    },
    parseTime(row, col) {
      return parseTime(row.createDateTime, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    parseRoles(row, col) {
      let roles = ''
      row.roles.forEach(element => {
        roles += ' ' + element.roleName
      })

      return roles
    },
    parseOrg(row, col) {
      if (row.organization == null) return ''
      return row.organization.organizationName
    },
    handleSelectionChange(val) {
      this.userSelection = val
    }
  }
}
</script>
