<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    height="600px"
    @selection-change="handleSelectionChange"
    v-autoHeightTable
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="角色名" prop="name" />
    <el-table-column label="备注" prop="memo" show-overflow-tooltip />
    <el-table-column label="状态" prop="status">
      <template #default="scope">
        <span
          class="dot"
          :style="{ backgroundColor: getStatusDotColor(scope.row.status) }"
        ></span>
        {{ getStatusDotText(scope.row.status) }}
      </template>
    </el-table-column>
    <el-table-column label="新建时间" prop="createTime" width="160px" />
    <el-table-column label="修改时间" prop="updateTime" width="160px" />
    <el-table-column label="操作" :fixed="'right'" width="200">
      <template #default="scope">
        <el-row class="mb-4">
          <el-button
            type="text"
            @click="goToEdit('RoleEdit', { id: scope.row.id })"
            >编辑</el-button
          >
          <el-button
            type="text"
            @click="goToDetail('RoleDetail', { id: scope.row.id })"
            >详情</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.status === 0"
            @click="enableRole({ id: scope.row.id })"
            >启用</el-button
          >
          <el-button
            type="text"
            v-if="scope.row.status === 1"
            @click="disableRole({ id: scope.row.id })"
            >禁用</el-button
          >
        </el-row>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, inject, watchEffect } from 'vue'
//   moveRole as moveRoleApi,
import {
  getRoleList as getRoleListApi,
  enableRole as enableRoleApi,
  disableRole as disableRoleApi
} from '@/api/role'
import { getStatusDotColor, getStatusDotText } from '@/hooks/table'
import { routerPush } from '@/router'
import { ElMessage } from 'element-plus'

const goToDetail = (name, params) => {
  window.localStorage.setItem('currentRoleId', params.id)
  routerPush({ name })
}
const goToEdit = (name, params) => {
  window.localStorage.setItem('currentRoleId', params.id)
  routerPush({ name })
}
const emit = defineEmits(['listChange', 'selectChange'])
const formData = inject('form-data')
const page = inject('page')
const multipleTableRef = ref()
const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  emit('selectChange', val)
}

const tableData = ref([])

const getRoleList = async () => {
  const params = page
  const { data } = await getRoleListApi(formData.value, params)
  // tableLoading.close()
  const { pager, list } = data
  tableData.value = list
  const pageResult = {
    page: pager.pageNo,
    total: pager.totalCount,
    limit: pager.pageSize
  }
  emit('listChange', { page: pageResult })
}

watchEffect(async () => {
  // console.log('watchEffect')

  const params = page
  const { data } = await getRoleListApi(formData.value, params)
  const { pager, list } = data
  tableData.value = list
  const pageResult = {
    page: pager.pageNo,
    total: pager.totalCount,
    limit: pager.pageSize
  }
  emit('listChange', { page: pageResult })
})

// 操作
const enableRole = async ({ id }) => {
  await enableRoleApi({ batchId: [id] })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getRoleList()
}

const disableRole = async ({ id }) => {
  await disableRoleApi({ batchId: [id] })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getRoleList()
}

defineExpose({
  refreshList: getRoleList
})
</script>
