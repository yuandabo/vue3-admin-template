<template>
  <div class="personal-center">
    <el-row :gutter="20">
      <el-col class="shop-detail-col"
              :span="16">
        <div>用户编号：{{detail.id}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="shop-detail-col"
              :span="16">
        <div>用户名称：{{detail.loginName}}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="shop-detail-col"
              :span="16">
        <div>密码：**********<el-button type="text" @click="dialogVisible = true">修改</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog v-model="dialogVisible"
               title="修改密码"
               width="400px">
      <ResetPasswordForm :current-id="detail.id" :closeDialog="closeDialog"/>
      <template #footer>
        <span class="dialog-footer">
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ResetPasswordForm from './components/ResetPasswordForm'
import { getUserDetail as getUserDetailApi } from '@/api/user'
import store from '@/store'

const dialogVisible = ref(false)
const detail = ref({
  id: '',
  name: ''
})

const closeDialog = () => {
  dialogVisible.value = false
}

// 获取数据
const getUserDetail = async () => {
  const search = { token: store.getters.token }
  const { data } = await getUserDetailApi(search)
  detail.value = data
}
getUserDetail()

</script>

<style lang="scss" scoped>
.personal-center {
  text-align: left;
  .shop-detail-col {
    padding: 20px 0;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  .el-dialog {
    top: 25vh;
  }
}
.el-dialog__footer{
  padding: 0;
}
</style>
