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
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
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

      const { data, code } = await this.$store.dispatch(
        'user/existAccount',
        value
      )

      if (code == 0 && data) {
        callback(new Error('账号[' + value + ']已经存在！'))
      }

      callback()
    }

    return {
      loading: false,
      userForm: {
        id: '',
        userName: '',
        password: '',
        lastLoginTime: '',
        companyName: '',
        isDelete: '',
        expired: '',
      },
      addRules: {
        userName: [
          { required: true, validator: validateAccount, trigger: 'change' },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs['userForm'].validate(async (valid) => {
        alert(valid)
      })
    },
    close() {
      this.$refs['userForm'].resetFields()
      this.$emit('close-addUser')
    },
  },
}
</script>