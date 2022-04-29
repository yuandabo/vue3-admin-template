<template>
  <teleport to="#dialog">
    <el-dialog v-model="dialogVisible" title="选择角色" width="70%">
      <div>
        <!-- form -->
        <RoleForm @search="search"></RoleForm>
        <!-- table -->
        <ChooseRoleTable
          ref="tableRef"
          @list-change="listChange"
          @select-change="selectChange"
        ></ChooseRoleTable>
        <RolePagination
          class="pagination"
          @pagination="pageChange"
          v-bind="page"
          :total="total"
        ></RolePagination>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="toggleDialog('cancel')">取消</el-button>
          <el-button type="primary" @click="toggleDialog"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </teleport>
</template>

<script setup>
import { reactive, provide, ref } from 'vue'
// import { ElMessage } from 'element-plus'
import RoleForm from '@/views/system/role/components/RoleForm.vue'
import ChooseRoleTable from './components/ChooseRoleTable.vue'
import RolePagination from '@/components/Pagination/index.vue'
const emits = defineEmits(['selectChange'])
// 表格逻辑
const tableRef = ref()
const listChange = ({ page: toPage }) => {
  page.page = toPage.page
  page.limit = toPage.limit
  total.value = toPage.total
}
const multipleSelection = ref([])
const selectChange = (val) => {
  multipleSelection.value = val
  emits('select-change', val)
}
provide('multipleSelection', multipleSelection)
// form逻辑
const form = ref({})
provide('form-data', form)
const search = (data) => {
  // console.log(data)
  resetPage()
  form.value = data
}
// 分页逻辑
const total = ref(0)
const page = reactive({
  page: 1,
  limit: 20
})
const resetPage = () => {
  page.page = 1
  page.limit = 20
}
provide('page', page)
const pageChange = (toPage) => {
  page.page = toPage.page
  page.limit = toPage.limit
}
// dialog
const dialogVisible = ref(false)
const toggleDialog = (type) => {
  if (type === 'cancel') {
    if (tableRef.value) {
      tableRef.value.clearSelection()
    }
  }
  dialogVisible.value = !dialogVisible.value
}
defineExpose({
  toggleDialog
})
</script>
