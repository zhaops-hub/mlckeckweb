<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="conditionJson.organizationName"
        placeholder="请输入组织结构"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button type="primary" @click="getOrgList">查询</el-button>
      <el-button type="primary" @click="addOrgList">添加</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="listLoading">
      <el-table-column prop="organizationName" label="机构名" width="120" />
      <el-table-column prop="path" label="分类" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.category==1000">业务分组</span>
          <span v-if="scope.row.category==1001">虚拟分组</span>
          <span v-if="scope.row.category==2000">省</span>
          <span v-if="scope.row.category==2001">市</span>
          <span v-if="scope.row.category==2002">县区</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="120" />
      <el-table-column prop="description" label="备注" width="300" />
      <el-table-column prop="createDateTime" :formatter="parseTime" label="创建时间" width="300" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editOrgList(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="deleteOrg(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="center"
      layout="prev, pager, next"
      :page-count="total"
      :current-page.sync="page"
      @current-change="getOrgList"
    />

    <div v-if="dialogVisible">
      <editOrg
        :id="id"
        :organization-name="organizationName"
        :dialog-visible="dialogVisible"
        @getOrgList="getOrgList"
        @close-editOrg="closedialog"
      />
    </div>
  </div>
</template>
<script lang='js'>
import { getOrganizations, deleteOrganizationsTree } from '../../api/org'
import editOrg from './components/editOrg'
import { parseGender, parseTime } from '@/utils'
export default {
  components: {
    editOrg
  },
  data() {
    return {
      conditionJson: {
        organizationName: ''
      },
      listLoading: true,
      tableData: [],
      total: 0,
      page: 0,
      dialogVisible: false,
      id: '',
      organizationName: ''
    }
  },
  mounted() {
    this.getOrgList()
  },
  methods: {
    async getOrgList() {
      this.listLoading = true
      const conditionJson = JSON.stringify(this.conditionJson)
      const page = this.page
      const result = await getOrganizations({
        page: page,
        rows: 10,
        conditionJson
      })

      this.listLoading = false
      this.tableData = result.result
      this.total = result.total
      this.page = result.page
    },

    addOrgList() {
      this.dialogVisible = true
      this.id = ''
    },
    editOrgList(scope) {
      this.id = scope.id
      this.organizationName = scope.organizationName
      this.dialogVisible = true
    },
    // 关闭弹出（监听子组件）
    closedialog() {
      this.dialogVisible = false
    },
    // 删除组织机构
    async deleteOrg(scope) {
      try {
        const conf = await this.$confirm(
          '此操作将永久删除该组织机构和所属子节点, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        this.deleteOrganizationsTree(scope.id)
      } catch {
        // 取消
      }
    },
    parseTime(row, col) {
      return parseTime(row.createDateTime, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    async deleteOrganizationsTree(id) {
      const data = await deleteOrganizationsTree(id)
      let msg = data.msg

      if (data.code === 0) {
        this.$message({
          message: `删除成功`,
          type: 'success'
        })
        this.getOrgList()
      } else {
        msg = data.msg
        this.$message({
          message: `${JSON.parse(msg)}`,
          type: 'warning'
        })
      }
    }
  }
}
</script>
