<template>
  <div>
    <el-form ref="fileForm" :model="fileForm" label-width="80px">
      <el-form-item label="序列">
        <el-input v-model="licenseData.serialNumber" />
      </el-form-item>
      <el-upload
        class="upload-demo"
        :action="updateLicUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :headers="headers"
        :before-upload="beforelicUpload"
        :limit="1"
        accept=".lic"
        :on-success="successLicUpload"
        :on-exceed="handleExceed"
        :file-list="fileForm.fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传lic文件</div>
      </el-upload>
      <el-upload
        class="upload-demo"
        :action="updateKeyUrl"
        :on-preview="handlePreview1"
        :headers="headers"
        :on-remove="handleRemove1"
        :before-upload="beforeAvatarUploadtxt"
        :limit="3"
        accept=".txt"
        :on-success="successLicUpload"
        :on-exceed="handleExceed1"
        :file-list="fileList2"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传txt文件</div>
      </el-upload>
    </el-form>
  </div>
</template>
<script>
import { uploadPublicKey, uploadLicense } from '../../../api/login/login'
import Common from '../../../utils/common'
const helper = Common.helper
export default {
  data() {
    return {
      serviceUrl: '',
      updateLicUrl: '',
      updateKeyUrl: '',
      fileForm: {
        seriesNum: '',
        fileList: []
      },
      fileList2: [],
      licenseData: {
        serialNumber: '',
        expiration: '',
        modules: []
      },
      headers: {
        'api-version': '1.0'
      }
    }
  },
  async mounted() {
    this.serviceUrl = await helper.getUmsUrl()
    this.updateLicUrl = this.serviceUrl + '/api/License/UploadLicense'
    this.updateKeyUrl = this.serviceUrl + '/api/License/UploadPublicKey'
    this.getLicense()
  },
  methods: {
    async getLicense() {
      const res = await this.$store.dispatch('license/getLicense')
      if (res.code == 0) {
        this.licenseData = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforelicUpload(file) {
      // const isLic = file.type === 'lic'
      // console.log(file.type)

      // if (!isLic) {
      //   this.$message.error('文件只能是 lic 格式!')
      // }
      // return isLic
      return true
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },

    handleRemove1(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview1(file) {
      console.log(file)
    },
    handleExceed1(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeAvatarUploadtxt(file) {
      const isTxt = file.type === 'text/plain'
      console.log(file.type)
      if (!isTxt) {
        this.$message.error('文件只能是 txt 格式!')
      }
      return isTxt
    },
    successLicUpload(response, file, fileList) {
      if (response.code == 0) {
        this.$message.success('上传成功！')
      } else {
        this.$message.error(response.msg)
      }
    },
    onSubmit() {}
  }
}
</script>
<style lang='css'>
.upload-demo {
  justify-content: end;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>

