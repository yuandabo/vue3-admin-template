<template>
  <div class="account">
    <!-- form -->
    <AccountForm @search="search"></AccountForm>
    <!-- table -->
    <AccountTable ref="accountTable" @list-change="listChange" @select-change="selectChange"></AccountTable>
    <footer class="footer">
      <div class="opreate">
        <el-button type="primary" @click="addAccount">
          <el-icon>
            <Plus />
          </el-icon>
          新建
        </el-button>
        <el-button @click="enableAccount">
          启用
        </el-button>
        <el-button @click="disableAccount">
          禁用
        </el-button>
      </div>
      <AccountPagination  class="pagination" @pagination="pageChange" v-bind="page" :total="total"></AccountPagination>
    </footer>
  </div>
</template>

<script setup>
import { reactive, provide, ref } from 'vue'
import { routerPush } from '@/router'
import { ElMessage } from 'element-plus'
import AccountForm from './components/AccountForm.vue'
import AccountTable from './components/AccountTable.vue'
import AccountPagination from '@/components/Pagination/index.vue'
import {
  enableAccount as enableAccountApi,
  disableAccount as disableAccountApi
} from '@/api/account'

const addAccount = function () {
  window.localStorage.removeItem('currentAccountId')
  routerPush({ name: 'AccountAdd' })
}
// 表格逻辑
const listChange = ({ page: toPage }) => {
  page.page = toPage.page
  page.limit = toPage.limit
  total.value = toPage.total
}
const multipleSelection = ref([])
const selectChange = (val) => {
  multipleSelection.value = val
}
provide('multipleSelection', multipleSelection)
const accountTable = ref()
const refreshList = () => {
  if (accountTable.value) accountTable.value.refreshList()
}
// form逻辑
const form = ref({})
provide('form-data', form)
const search = (data) => {
  // console.log(data)
  form.value = data
}
// 分页逻辑
const total = ref(0)
const page = reactive({
  page: 1,
  limit: 20,
  total: 0
})
provide('page', page)
const pageChange = (toPage) => {
  page.page = toPage.page
  page.limit = toPage.limit
}
// 操作
const enableAccount = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择数据再进行相关操作'
    })
    return
  }

  const id = multipleSelection.value.map((item) => item.id)
  await enableAccountApi({ batchId: id })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  refreshList()
}
const disableAccount = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择数据再进行相关操作'
    })
    return
  }

  const id = multipleSelection.value.map((item) => item.id)
  await disableAccountApi({ batchId: id })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  refreshList()
}
</script>

<style lang="scss" scoped>
.account {
  text-align: left;
  .footer {
    margin-top: 10px;
    display: flex;
  }
  .opreate {
    flex: 1;
    display: flex;
    align-items: center;
  }
  .pagination {
    margin-top: 0;
    flex: 1;
    background: transparent;
  }
}
</style>
