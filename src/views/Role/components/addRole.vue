<template>
  <el-dialog v-loading="loading" title="编辑权限" :visible="dialogVisible" width="30%" @close="close">
    <el-form
      ref="roleForm"
      :model="roleForm"
      status-icon
      :rules="addRules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="权限名称" prop="roleName">
        <el-input
          ref="roleName"
          v-model="roleForm.roleName"
          type="text"
          placeholder="权限名称"
          name="roleName"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" :rows="4" placeholder="描述" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRolebyId, getRoles } from '../../../api/role'
export default {
  props: ['id', 'dialogVisible'],
  data() {
    return {
      loading: false,
      roleForm: {
        roleName: '',
        description: '',
        id: ''
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入权限名称！', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    if (this.id !== '') {
      this.getRolebyId()
    }
  },
  methods: {
    submit() {
      this.$refs['roleForm'].validate(async valid => {
        if (valid) {
          // if (this.id == '') {
          const res = await this.$store.dispatch('role/addRole', this.roleForm)
          if (res.code == 0) {
            this.close()
          } else {
            this.$message.error(res.msg)
          }
          // }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getRolebyId() {
      const data = await getRolebyId(this.id)
      if (data.code === 0) {
        this.roleForm.roleName = data.data.roleName
        this.roleForm.description = data.data.description
        this.roleForm.id = data.data.id
      }
    },
    close() {
      this.$refs['roleForm'].resetFields() // 清空表单
      this.$emit('close-addRole')
    }
  }
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
