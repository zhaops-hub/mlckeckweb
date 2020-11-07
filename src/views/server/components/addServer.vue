<template>
  <el-dialog v-loading="loading" title="编辑" :visible="dialogVisible" width="30%" @close="close">
    <el-form
      :model="serverForm"
      status-icon
      :rules="addServer"
      ref="serverForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="Key" prop="name">
        <el-col>
          <el-input type="text" placeholder="Key" v-model="serverForm.name"></el-input>
        </el-col>
        <el-col>
          <el-tooltip placement="top">
            <div slot="content">服务往identityserver 注册时的key 必须一致</div>
            <el-button type="info" icon="el-icon-question"></el-button>
          </el-tooltip>
        </el-col>
      </el-form-item>
      <el-form-item label="服务名" prop="displayName">
        <el-input type="text" placeholder="服务名称" v-model="serverForm.displayName"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" :rows="4" placeholder="描述" v-model="serverForm.description"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="info" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import passwordValidator from 'password-validator'
export default {
  props: ['id', 'dialogVisible'],
  data() {
    const validateKey = async (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
        return
      }
      var schema = new passwordValidator()
      schema.has(/[\u4E00-\u9FA5\uF900-\uFA2D]/)
      if (schema.validate(value)) {
        callback(new Error('不能输入中文'))
      } else {
        const isExit = await this.$store.dispatch('server/existServerName', {
          name: value,
          id: this.serverForm.id
        })

        if (isExit) {
          callback(new Error('key[' + value + ']已经存在！'))
        }

        callback()
      }
    }

    return {
      loading: false,
      serverForm: {
        id: '',
        name: '',
        displayName: '',
        description: ''
      },
      addServer: {
        name: { required: true, validator: validateKey, trigger: 'change' },
        displayName: {
          required: true,
          message: '请输入服务名！',
          trigger: 'change'
        }
      }
    }
  },
  mounted() {
    if (this.id != '') {
      this.getServerById()
    }
  },
  methods: {
    async getServerById() {
      this.loading = true
      const res = await this.$store.dispatch('server/getServerById', {
        id: this.id
      })
      if (res.code == 0) {
        this.loading = false
        this.serverForm = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    submit() {
      this.$refs['serverForm'].validate(async valid => {
        if (valid) {
          const res = await this.$store.dispatch(
            'server/addServer',
            this.serverForm
          )
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
    },
    close() {
      this.$refs['serverForm'].resetFields()
      this.$emit('close-addServer')
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