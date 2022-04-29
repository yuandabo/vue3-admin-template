<template>
  <div class="upload-container">
    <el-button type="primary" @click=" dialogVisible=true">
      <el-icon class="el-icon--left"><Upload /></el-icon>
      上传
    </el-button>
    <el-dialog v-model="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        :action="`/api/admin/notice/upload`"
        list-type="picture-card"
        :headers="{
          'prop-token': token,
        }"
        name="uploadFile"
      >
        <el-button type="primary">
          点击上传
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { ElMessage } from 'element-plus'
import store from '@/store'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data () {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  computed: {
    token () {
      return store.getters.token || ''
    }
  },
  methods: {
    checkAllSuccess () {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit () {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        ElMessage({
          content: '请等待上传完成！'
        })
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess (response, file) {
      // console.log(response)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data.url
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove (file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload (file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function () {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
