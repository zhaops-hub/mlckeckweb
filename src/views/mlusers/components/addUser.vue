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
      label-width="100px"
      :rules="addRules"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input
          ref="userName"
          v-model="userForm.userName"
          type="text"
          placeholder="用户名"
          name="userName"
        />
      </el-form-item>

      <el-form-item label="公司名" prop="companyName">
        <el-input
          ref="companyName"
          v-model="userForm.companyName"
          type="text"
          placeholder="公司名"
          name="companyName"
        />
      </el-form-item>

      <el-form-item v-if="id == ''" label="密码" prop="password">
        <el-input
          v-model="userForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item v-if="id == ''" label="确认密码" prop="checkPassword">
        <el-input
          v-model="userForm.checkPassword"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="超级管理员" prop="isAdmin">
        <el-radio v-model="userForm.isAdmin" name="isAdmin" label="1"
          >是</el-radio
        >
        <el-radio v-model="userForm.isAdmin" name="isAdmin" label="0"
          >否</el-radio
        >
      </el-form-item>
      <el-form-item label="过期时间" prop="expired">
        <el-date-picker
          v-model="userForm.expired"
          align="right"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Common from '../../../utils/common'
import { addUser, getUser } from '../../../api/user'
import { getToken } from '@/utils/auth'
import passwordValidator from 'password-validator'
import { Form } from 'element-ui'
const helper = Common.helper
const md5 = require('md5')

export default {
  props: ['id', 'dialogVisible'],
  data() {
    // 账号验证
    const validateAccount = async (rule, value, callback) => {
      let param = value

      if (this.userForm.id) {
        param += '/' + this.userForm.id
      } else {
        param += '/-1'
      }
      if (!value) {
        callback(new Error('请输入账号！'))
      }

      const { data, code } = await this.$store.dispatch(
        'user/existAccount',
        param
      )

      if (code == 0 && data) {
        callback(new Error('账号[' + value + ']已经存在！'))
      }

      callback()
    }

    // 验证密码
    const validatePass = (rule, value, callback) => {
      var schema = new passwordValidator()
      schema
        .is()
        .min(6) // Minimum length 8
        .is()
        .max(16) // Maximum length 100

      if (!schema.validate(value)) {
        callback(new Error('密码格式不正确(6-16位)'))
      } else {
        callback()
      }
    }
    const validateCheckpass = (rule, value, callback) => {
      if (value != this.userForm.password) {
        callback(new Error('密码输入不一致'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      userForm: {
        id: '',
        userName: '',
        password: '',
        checkPassword: '',
        lastLoginTime: '',
        companyName: '',
        isAdmin: '0',
        isDelete: '',
        expired: '',
      },
      addRules: {
        userName: [
          { required: true, validator: validateAccount, trigger: 'change' },
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'change' },
        ],
        checkPassword: [
          { required: true, validator: validateCheckpass, trigger: 'change' },
        ],
        isAdmin: [
          { required: true, message: '请选择是否是管理员', trigger: 'change' },
        ],
        expired: [
          { required: true, message: '请选择日期!', trigger: 'change' },
        ],
        companyName: [
          { required: true, message: '请输入公司名称!', trigger: 'change' },
        ],
      },
      //  日期选择器快捷键
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: '明天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: '一周后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
        ],
      },
    }
  },
  created() {
    this.userForm.id = this.id
    if (this.userForm.id) {
      this.getUserById()
    }
  },
  methods: {
    async getUserById() {
      this.loading = true
      const { code, data, msg } = await getUser(this.userForm.id)
      this.loading = false
      if (code == 0) {
        this.userForm = data
        this.userForm.isAdmin = this.userForm.isAdmin + ''
      } else {
        this.$message.error(msg)
      }
    },
    submit() {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          this.userForm.password = md5(this.userForm.password)
          const { code, data, msg } = await addUser(this.userForm)
          if (code == 0) {
            this.close()
          } else {
            this.$message.error(msg)
          }
        }
      })
    },
    close() {
      this.$refs['userForm'].resetFields()
      this.$emit('close-addUser')
    },
  },
}
</script>