<template>
  <el-dialog title="提示" :visible="dialogVisible" width="50%" @close="close">
    <el-form
      ref="ruleForm"
      :label-position="labelPosition"
      :rules="rules"
      label-width="80px"
      :model="orgForm"
    >
      <el-form-item label="机构分类" prop="categoryVal">
        <el-select v-model="categoryVal" placeholder="请选择">
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="正在绑定行政区划" v-if="categoryVal=='2'" prop="currArea">
        <el-tag type="success">{{!currArea.path?"无":currArea.path}}</el-tag>
      </el-form-item>

      <el-form-item label="是否为虚拟机构" v-if="categoryVal=='1'" prop="b">
        <el-checkbox v-model="isVirtual">是否为虚拟机构</el-checkbox>
      </el-form-item>

      <el-form-item label="机构名称" prop="organizationName">
        <!-- <el-input v-model="orgForm.organizationName" /> -->

        <el-autocomplete
          class="inline-input"
          v-model="orgForm.organizationName"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="orgForm.address" />
      </el-form-item>
      <el-form-item label="权限" prop="selectRoles">
        <el-select
          v-model="orgForm.selectRoles"
          v-loading="roleLoading"
          multiple
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="orgForm.description" type="textarea" />
      </el-form-item>
      <el-form-item label="父级" v-if="categoryVal=='1'" prop="parentId">
        <el-tree
          ref="treeForm"
          :props="treeprops"
          check-strictly
          node-key="id"
          :data="orgData"
          show-checkbox
          @check-change="handleCheckChange"
        />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" :disabled="submitDisabled" @click="confirm('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRoles } from '../../../api/role'
import {
  getOrganizations,
  getOrganizationsByid,
  getOrganizationsTree,
  editOrganizations,
  getAreasByName,
  getAreasByCode
} from '../../../api/org'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
export default {
  props: {
    dialogVisible: Boolean,
    id: String,
    organizationName: String
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        if (this.categoryVal == '1') {
          callback(new Error('请输入组织机构名称！'))
          return
        }
        if (this.categoryVal == '2' && !this.currArea.id) {
          callback(new Error('请先选择一个对应的行政区划！'))
          return
        }
      } else {
        if (this.categoryVal == '2' && !this.currArea.id) {
          callback(new Error('请先选择一个对应的行政区划！'))
          return
        }
      }

      callback()
    }

    const validateCurrArea = (rule, value, callback) => {
      callback()
    }
    const validateParentId = (rule, value, callback) => {
      if (this.categoryVal == '1' && !value) {
        callback(new Error('请选择父节点！'))
      }

      callback()
    }

    return {
      isVirtual: false,
      categoryVal: '',
      categoryOptions: [
        {
          value: '1',
          label: '业务分类'
        },
        {
          value: '2',
          label: '行政区划'
        }
      ],
      currArea: {},
      orgForm: {
        address: '',
        roles: [],
        parentId: '',
        category: 0,
        organizationName: '',
        organizationNo: '',
        selectRoles: []
      },
      submitDisabled: false,
      roles: [],
      roleLoading: true,
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      treeprops: {
        label: 'organizationName',
        children: 'childNodes'
      },
      count: 1,
      orgData: [],
      i: 0,
      rules: {
        organizationName: [
          { required: true, validator: validateName, trigger: 'change' }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'change' }],
        selectRoles: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ],
        currArea: [
          { required: true, validator: validateCurrArea, trigger: 'change' }
        ],
        parentId: [
          { required: true, validator: validateParentId, trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.categoryVal = '1'
    this.getRoles()
    this.getOrgs()
    if (this.id === '') {
    } else {
    }
  },
  watch: {
    categoryVal(val) {
      if (val == '1') {
        this.orgForm.category = 1000

        // 如果是虚拟组织
        if (this.isVirtual) {
          this.orgForm.category = 1001
        }
      }

      this.currArea = {}
    },
    isVirtual(val) {
      if (this.categoryVal != '1') return
      if (val) this.orgForm.category = 1001
      else {
        this.orgForm.category = 1000
      }
    }
  },
  methods: {
    async querySearch(queryString, cb) {
      if (this.categoryVal != '2') cb([])
      let data = await getAreasByName(queryString)
      if (data.code == 0) {
        for (let item in data.result) {
          data.result[item].value = data.result[item].path
        }
        cb(data.result)
      }
    },
    handleSelect(item) {
      this.orgForm.organizationName = item.areaName
      this.currArea = item
      this.orgForm.organizationNo = item.areaCode
      this.orgForm.category = item.orgType
    },
    // 关闭弹出 （字传父）
    close() {
      this.$emit('close-editOrg')
    },
    async getRoles() {
      const data = await getRoles({})
      if (data.code == 0) {
        this.roles = data.result
        this.roleLoading = false
      }
    },
    selectChange(val) {
      this.$forceUpdate()
    },
    // 编辑组织机构
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.orgForm.roles = []
          this.orgForm.selectRoles.forEach(element => {
            this.orgForm.roles.push({ id: element })
          })
          if (this.id === '') {
            // 添加组织机构
            this.editOrg()
          } else {
            // 上级组织机构
            this.orgForm.id = this.id
            this.editOrg()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑组织机构
    async editOrg() {
      const message = this.id == '' ? '添加' : '修改'
      // this.submitDisabled = true
      NProgress.start()
      const data = await editOrganizations(this.orgForm)
      NProgress.done()
      // this.submitDisabled = false
      if (data.code === 0) {
        this.$message({
          message: `${message}成功`,
          type: 'success'
        })
        this.close()
      } else {
        this.$message({
          message: `${data.msg}`,
          type: 'error'
        })
      }

      this.$emit('getOrgList')
    },
    handleCheckChange(data, checked, indeterminate) {
      this.i++
      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.treeForm.setCheckedNodes([])
          this.$refs.treeForm.setCheckedNodes([data])
          // 交叉点击节点
        } else {
          this.$refs.treeForm.setCheckedNodes([])
          // 点击已经选中的节点，置空
        }
      }
      this.orgForm.parentId = data.id
    },
    // 获取组织机构树
    async getOrgs() {
      const data = await getOrganizationsTree({})
      this.orgData = data
      if (this.id !== '') {
        this.recursion(this.orgData)
        console.log(this.orgData)
      }
      if (this.id !== '') {
        this.getOrganizationsByid()
      }
      // 回填表单
      // 获取权限
      this.getRoles()
    },

    // 递归遍历
    recursion(data, type = 1) {
      data.forEach((element, index) => {
        if (element.id === this.id) {
          element.disabled = true
          return
        } else {
          if (element.childNodes && element.childNodes.length > 0) {
            this.recursion(element.childNodes)
          }
        }
      })
    },
    // 根据id查组织机构
    async getOrganizationsByid() {
      const data = await getOrganizationsByid(this.id)
      if (data.code === 0) {
        this.orgForm = data.data
        this.orgForm.selectRoles = []
        data.data.roles.forEach(element => {
          if (this.orgForm.selectRoles.filter(d => d == element.id).length == 0)
            this.orgForm.selectRoles.push(element.id)
        })

        // 业务分组
        if (data.data.category == 1000 || data.data.category == 1001) {
          this.categoryVal = '1'
          if (data.data.category == 1001) {
            this.isVirtual = true
          }

          // 树的回显
          this.checkedNodes(data.data.parentId)
        } else {
          // 行政区划
          this.categoryVal = '2'

          // 获取行政区数据
          let d = await getAreasByCode(data.data.organizationNo)
          if (d.code == 0 && d.result.length > 0) {
            this.currArea = d.result[0]
            let name = this.orgForm.organizationName
            this.orgForm.organizationName = ''
            setTimeout(() => {
              this.orgForm.organizationName = name
            }, 500)
          }
        }
      }
    },
    // tree 回显
    setCheckedNodes(node) {
      this.$refs.treeForm.setCheckedNodes([node])
    },

    checkedNodes(parentId) {
      if (!parentId) return
      console.log(this.$refs.treeForm.data)
      for (const i in this.$refs.treeForm.data) {
        this.selectChild(this.$refs.treeForm.data[i], parentId)
      }
    },

    selectChild(tree, parentId) {
      if (tree.id == parentId) {
        this.setCheckedNodes(tree)
        return true
      }
      if (tree.childNodes.length == 0) return
      for (const i in tree.childNodes) {
        if (this.selectChild(tree.childNodes[i], parentId)) {
          //this.setCheckedNodes(tree)
          // 父节点不联动
        }
      }
    }
  }
}
</script>
<style>
.el-tree {
  height: 300px;
  overflow: auto;
}
</style>

