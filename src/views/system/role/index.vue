<template>
  <div class="role">
    <!-- form -->
    <RoleForm @search="search"></RoleForm>
    <!-- table -->
    <RoleTable ref="tableRef" @list-change="listChange" @select-change="selectChange"></RoleTable>
    <footer class="footer">
      <div class="opreate">
        <el-button type="primary" @click="addRole">
          <el-icon>
            <Plus />
          </el-icon>
          新建
        </el-button>
        <el-button @click="enableRole">
          启用
        </el-button>
        <el-button @click="disableRole">
          禁用
        </el-button>
      </div>
      <RolePagination class="pagination" @pagination="pageChange" v-bind="page" :total="total"></RolePagination>
    </footer>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, provide, ref } from 'vue'
import { routerPush } from '@/router'
import RoleForm from './components/RoleForm.vue'
import RoleTable from './components/RoleTable.vue'
import RolePagination from '@/components/Pagination/index.vue'
import {
  enableRole as enableRoleApi,
  disableRole as disableRoleApi
} from '@/api/role'

const addRole = function () {
  window.localStorage.removeItem('currentRoleId')
  routerPush({ name: 'RoleAdd' })
}
// 表格逻辑
const tableRef = ref()
const listChange = ({ page: toPage }) => {
  // console.log(toPage)
  page.page = toPage.page
  page.limit = toPage.limit
  total.value = toPage.total
}
const multipleSelection = ref([])
const selectChange = (val) => {
  multipleSelection.value = val
}
provide('multipleSelection', multipleSelection)
const refreshList = () => {
  if (tableRef.value) tableRef.value.refreshList()
}
// form逻辑
const form = ref({})
provide('form-data', form)
const search = (data) => {
  form.value = data
}
// 分页逻辑
const total = ref(0)
const page = reactive({
  page: 1,
  limit: 20
})
provide('page', page)
const pageChange = (toPage) => {
  page.page = toPage.page
  page.limit = toPage.limit
}
// 操作
const enableRole = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择数据再进行相关操作'
    })
    return
  }

  const id = multipleSelection.value.map((item) => item.id)
  await enableRoleApi({ batchId: id })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  refreshList()
}
const disableRole = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择数据再进行相关操作'
    })
    return
  }

  const id = multipleSelection.value.map((item) => item.id)
  await disableRoleApi({ batchId: id })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  refreshList()
}
</script>

<style lang="scss" scoped>
.role {
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
