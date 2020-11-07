<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-container">
        <el-input
          v-model="conditionJson.roleName"
          placeholder="权限名称"
          style="width: 200px;"
          class="filter-item"
        />
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="addRole">添加</el-button>
      </div>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="权限名" prop="roleName" width="*" align="center" />
      <el-table-column label="备注" prop="description" width="*" align="center" />
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
        width="320px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="editRole(row)">修改</el-button>
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">查看用户</el-button> -->
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">查看组织机构</el-button> -->
          <el-button type="primary" size="mini" @click="deleteRole(row)">删除</el-button>
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
      <AddRole :id="id" :dialog-visible="dialogVisible" @close-addRole="closeAddRole" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Message } from 'element-ui'
import { parseGender, parseTime } from '@/utils'
import { deleteRolebyId, getRolebyId } from './../../api/role'
import AddRole from './components/addRole'
export default {
  name: 'RoleList',
  components: { Pagination, AddRole },
  data() {
    return {
      id: '',
      tableKey: 'usertable',
      listLoading: false,
      list: [],
      dialogVisible: false,
      listQuery: {
        page: 1,
        rows: 10
      },
      conditionJson: {
        roleName: ''
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      this.listQuery.conditionJson = JSON.stringify(this.conditionJson)
      const res = await this.$store.dispatch('role/getRoles', this.listQuery)
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
    parseTime(row, col) {
      return parseTime(row.createDateTime, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    addRole() {
      this.dialogVisible = true
      this.id = ''
    },
    async editRole(row) {
      this.dialogVisible = true
      this.id = row.id
    },
    async deleteRole(row) {
      const data = await deleteRolebyId(row.id)
      if (data.code === 0) {
        this.$message({
          message: `删除成功`,
          type: 'success'
        })
        this.getList()
      } else {
        const msg = data.msg
        if (msg != '') {
          this.$message({
            message: `${JSON.parse(msg)}`,
            type: 'warning'
          })
        } else {
          this.$message({
            message: `删除失败`,
            type: 'warning'
          })
        }
      }
    },
    closeAddRole() {
      this.dialogVisible = false
      this.getList()
    }
  }
}
</script>
