<template>
  <el-dialog v-loading="loading" title="编辑" :visible="dialogVisible" width="50%" @close="close">
    <el-form
      :model="clientForm"
      status-icon
      :rules="addClient"
      ref="clientForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="客户端ID" prop="clientId">
        <el-col>
          <el-input type="text" placeholder="客户端ID" v-model="clientForm.clientId"></el-input>
        </el-col>
        <el-col>
          <el-tooltip placement="top">
            <div slot="content">客户端获取访问token是 需要的参数</div>
            <el-button type="info" icon="el-icon-question"></el-button>
          </el-tooltip>
        </el-col>
      </el-form-item>
      <el-form-item label="授权方式" prop="allowedGrantTypes">
        <el-select v-model="clientForm.allowedGrantTypes" placeholder="请选择">
          <el-option v-for="item in grantTypes" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="token时长" prop="accessTokenLifetime">
        <el-input-number v-model="clientForm.accessTokenLifetime_hour" :min="0" :max="59" label="时"></el-input-number>时
        <el-input-number v-model="clientForm.accessTokenLifetime_min" :min="0" :max="59" label="分"></el-input-number>分
        <el-input-number v-model="clientForm.accessTokenLifetime_sec" :min="0" :max="59" label="秒"></el-input-number>秒
      </el-form-item>
      <el-form-item label="资源" prop="allowedScopes">
        <el-select
          v-model="clientForm.allowedScopes"
          v-loading="scopesLoading"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in servers"
            :key="item.name"
            :label="item.displayName"
            :value="item.name"
          ></el-option>
        </el-select>
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
import { timeStamp } from '@/utils'
export default {
  props: ['id', 'dialogVisible'],
  data() {
    const validateClientId = async (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'))
        return
      }
      var schema = new passwordValidator()
      schema.has(/[\u4E00-\u9FA5\uF900-\uFA2D]/)
      if (schema.validate(value)) {
        callback(new Error('不能输入中文'))
      } else {
        const isExit = await this.$store.dispatch('client/existClientId', {
          clientId: value,
          id: this.clientForm.id
        })

        if (isExit) {
          callback(new Error('客户端Id[' + value + ']已经存在！'))
        }

        callback()
      }
    }

    const validateAccessTokenLifetime = (rule, value, callback) => {
      var sec =
        this.clientForm.accessTokenLifetime_hour * 60 * 60 +
        this.clientForm.accessTokenLifetime_min * 60 +
        this.clientForm.accessTokenLifetime_sec

      if (sec <= 0) {
        callback(new Error('请输入token时长'))
      } else {
        callback()
        this.clientForm.accessTokenLifetime = sec
      }
    }

    const validateAllowedScopes = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error('至少选择一个资源'))
      }
    }

    return {
      grantTypes: [
        {
          id: 'password',
          value: 'password'
        }
      ],
      loading: false,
      scopesLoading: false,
      servers: [],
      clientForm: {
        id: '',
        clientId: '',
        allowedGrantTypes: '',
        description: '',
        accessTokenLifetime: 0,
        accessTokenLifetime_hour: 0,
        accessTokenLifetime_min: 0,
        accessTokenLifetime_sec: 0,
        allowedScopes: []
      },
      addClient: {
        clientId: {
          required: true,
          validator: validateClientId,
          trigger: 'change'
        },
        allowedGrantTypes: {
          required: true,
          message: '请选择授权方式',
          trigger: 'change'
        },
        accessTokenLifetime: {
          required: true,
          validator: validateAccessTokenLifetime,
          trigger: 'change'
        },
        allowedScopes: {
          required: true,
          validator: validateAllowedScopes,
          trigger: 'change'
        }
      }
    }
  },
  mounted() {
    this.getServers()
    if (this.id != '') {
      this.getServerById()
    }
  },
  methods: {
    async getServerById() {
      this.loading = true
      const res = await this.$store.dispatch('client/getClientById', {
        id: this.id
      })

      if (res.code == 0) {
        this.loading = false
        this.clientForm = res.data
        var tempScope = []
        for (const i in this.clientForm.allowedScopes) {
          if (
            this.clientForm.allowedScopes[i] == 'openid' ||
            this.clientForm.allowedScopes[i] == 'profile' ||
            this.clientForm.allowedScopes[i] == 'custom.profile' ||
            !this.clientForm.allowedScopes[i]
          )
            continue

          tempScope.push(this.clientForm.allowedScopes[i])
        }

        this.clientForm.allowedScopes = tempScope
        console.log(this.clientForm.allowedScopes);
        //时间转换
        var time = timeStamp(this.clientForm.accessTokenLifetime)
        this.clientForm.accessTokenLifetime_hour = time.h
        this.clientForm.accessTokenLifetime_min = time.m
        this.clientForm.accessTokenLifetime_sec = time.s

      } else {
        this.$message.error(res.msg)
      }
    },
    async getServers() {
      this.scopesLoading = true
      const where = {
        rows: 0,
        page: 0,
        conditionJson: ''
      }
      const res = await this.$store.dispatch('server/getServers', where)
      if (res.code == 0) {
        this.scopesLoading = false
        this.servers = res.result
      } else {
      }
    },
    submit() {
      this.$refs['clientForm'].validate(async valid => {
        if (valid) {
          const res = await this.$store.dispatch(
            'client/addClient',
            this.clientForm
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
      this.$refs['clientForm'].resetFields()
      this.$emit('close-addClient')
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