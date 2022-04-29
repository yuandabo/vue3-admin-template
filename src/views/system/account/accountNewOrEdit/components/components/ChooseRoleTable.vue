<template>
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    height="300px"
    @selection-change="handleSelectionChange"
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
  </el-table>
</template>

<script setup>
import { ref, inject, watchEffect } from 'vue'
import {
  getRoleList as getRoleListApi
} from '@/api/role'
import { getStatusDotColor, getStatusDotText } from '@/hooks/table'
const emit = defineEmits(['selectChange', 'listChange'])
const formData = inject('form-data')
const page = inject('page')
const multipleTableRef = ref()
const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  emit('selectChange', val)
}
const clearSelection = () => {
  if (multipleTableRef.value) {
    multipleTableRef.value.clearSelection()
  }
}

const tableData = ref([])

const getList = async () => {
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

defineExpose({
  getList,
  clearSelection
})
</script>
