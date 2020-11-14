<template>
  <el-dialog
    v-loading="loading"
    title="编辑用户"
    :visible="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    top="3vh"
    @close="close"
  >
    <el-form
      ref="userForm"
      :model="userForm"
      status-icon
      :rules="addRules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="account">
        <el-input
          ref="account"
          v-model="userForm.account"
          type="text"
          placeholder="账号"
          name="account"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="userForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input
          v-model="userForm.checkPassword"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="userForm.realName" type="text" />
      </el-form-item>

      <el-form-item label="电话" prop="mobile">
        <el-input v-model="userForm.mobile" type="text" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" type="text" />
      </el-form-item>

      <el-form-item label="权限" prop="checkedRoles">
        <el-select
          v-model="checkedRoles"
          v-loading="roleLoading"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="组织机构" prop="organizationId">
        <el-select
          v-model="userForm.organizationId"
          v-loading="orgLoading"
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in orgs"
            :key="item.id"
            v-loading="fileLoading"
            :label="item.organizationName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="prevideAvatar" :src="prevideAvatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="userForm.gender" name="gender" label="1"
          >男</el-radio
        >
        <el-radio v-model="userForm.gender" name="gender" label="0"
          >女</el-radio
        >
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { validatePass } from './validate'
import Common from '../../../utils/common'
import { getToken } from '@/utils/auth'
const helper = Common.helper

export default {
  props: ['id', 'dialogVisible'],
  data() {
    const validateAccount = async (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号！'))
      }

      const isExit = await this.$store.dispatch('user/existAccount', {
        account: value,
        userId: this.userForm.id,
      })

      if (isExit) {
        callback(new Error('账号[' + value + ']已经存在！'))
      }

      callback()
    }

    const validateCheckpass = (rule, value, callback) => {
      if (value != this.userForm.password) {
        callback(new Error('密码输入不一致'))
      } else {
        callback()
      }
    }

    const validateMobile = (rule, value, callback) => {
      if (value == '') callback()
      var regu = /^1[34578]\d{9}$/
      var re = new RegExp(regu)
      if (re.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式错误！'))
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (value == '') callback()
      var regu = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      var re = new RegExp(regu)
      if (re.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式错误！'))
      }
    }

    const validateRole = (rule, value, callback) => {
      if (this.checkedRoles.length == 0) {
        callback(new Error('请选择权限'))
      } else {
        callback()
      }
    }

    return {
      value1: [],
      checkedRoles: [],
      prevideAvatar: '',
      userForm: {
        mobile: '',
        id: '',
        account: '',
        password: '',
        checkPassword: '',
        realName: '',
        organizationId: '',
        avatar: '',
        gender: '1',
        mobile: '',
        email: '',
        description: '',
        roles: [],
      },
      orgs: [],
      roles: [],
      loading: false,
      orgLoading: true,
      roleLoading: true,
      fileLoading: false,
      uploadUrl: '',
      headers: {
        'api-version': '1.0',
        Authorization: 'Bearer ' + getToken(),
      },
      addRules: {
        account: [
          { required: true, validator: validateAccount, trigger: 'change' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'change' },
        ],
        checkPassword: [
          { required: true, validator: validateCheckpass, trigger: 'change' },
        ],
        realName: [
          { required: true, message: '请输入姓名！', trigger: 'change' },
        ],
        mobile: [
          { required: false, validator: validateMobile, trigger: 'change' },
        ],
        email: [
          { required: false, validator: validateEmail, trigger: 'change' },
        ],
        organizationId: [
          { required: true, message: '请输入组织机构！', trigger: 'change' },
        ],
        checkedRoles: [
          { required: true, validator: validateRole, trigger: 'change' },
        ],
      },
    }
  },
  created() {},
  async mounted() {
    this.uploadUrl = (await helper.getUmsUrl()) + '/api/User/UploadAvatar'
    this.userForm.id = this.id
    this.getOrgs()
  },
  methods: {
    async getUserById() {
      this.loading = true
      const res = await this.$store.dispatch('user/getUserById', {
        userId: this.userForm.id,
      })
      if (res.code == 0) {
        this.checkedRoles = []
        this.loading = false
        this.userForm = res.data

        this.prevideAvatar = (await helper.getUmsUrl()) + this.userForm.avatar

        //角色多选回填
        let tempRole = []
        for (const i in res.data.roles) {
          //过滤掉下拉菜单里面 没有的权限
          if (
            this.roles.filter((d) => d.id == res.data.roles[i].id).length == 0
          )
            continue
          tempRole.push(res.data.roles[i].id)
        }

        this.checkedRoles = tempRole
        //组织机构判断是否存在
        if (
          this.orgs.filter((d) => d.id == this.userForm.organizationId)
            .length == 0
        ) {
          this.userForm.organizationId = ''
        }

        //把性别int转成string
        this.userForm.gender = this.userForm.gender.toString()
      } else {
        this.$message.error(res.msg)
      }
    },
    async handleAvatarSuccess(res, file) {
      if (res.code == 0) {
        this.fileLoading = false
        this.userForm.avatar = '/StaticFiles/avatar/' + res.data
        this.prevideAvatar =
          (await helper.getUmsUrl()) + '/StaticFiles/avatar/' + res.data
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      if (isJPG && isLt2M) this.fileLoading = true
      return isJPG && isLt2M
    },
    async getOrgs() {
      const data = await this.$store.dispatch('org/getOrganizations', {})
      if (data.code == 0) {
        this.orgs = data.result
        this.orgLoading = false

        // 回填表单

        // 获取权限
        this.getRoles()
      }
    },
    async getRoles() {
      const data = await this.$store.dispatch('role/getRoles', {})
      if (data.code == 0) {
        this.roles = data.result
        this.roleLoading = false

        // 回填表单
        if (this.id != '') {
          this.getUserById()
        }
      }
    },
    submit() {
      // console.log(this.userForm.roles);
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          // 转换权限
          const tempRoles = []
          console.log(this.userForm.roles)
          for (const key in this.roles) {
            if (
              this.checkedRoles.filter((d) => {
                return d.indexOf(this.roles[key].id) > -1
              }).length > 0
            ) {
              tempRoles.push(this.roles[key])
            }
          }

          this.userForm.roles = tempRoles
          const res = await this.$store.dispatch('user/addUser', this.userForm)
          if (res.code == 0) {
            this.close()
          } else {
            this.$message.error(res.msg)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // this.$emit('close-addUser')
    },
    close() {
      this.$refs['userForm'].resetFields()
      this.$emit('close-addUser')
    },
  },
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
