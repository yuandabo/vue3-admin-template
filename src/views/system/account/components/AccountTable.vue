<template>
  <div class="table">
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      height="600px"
      @selection-change="handleSelectionChange"
      v-autoHeightTable
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="员工编号" prop="id" width="80"/>
      <el-table-column label="员工姓名" prop="name" />
      <el-table-column label="登录账号" prop="loginName" />
      <el-table-column label="部门" prop="departmentName" />
      <!-- <el-table-column label="系统角色" prop="" >
        <template #default="scope">
          <el-tag v-for="scope.role"></el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="联系方式" prop="phone" />
      <el-table-column label="入职时间" prop="joinTime" width="170px" />
      <el-table-column label="新建时间" prop="createTime" width="170px" />
      <el-table-column
        label="状态"
        prop="status"
      >
        <template #default="scope">
          <span
            class="dot"
            :style="{ backgroundColor: getStatusDotColor(scope.row.status) }"
          ></span>
          {{ getStatusDotText(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" :fixed="'right'" width="200">
        <template #default="scope">
          <el-row class="mb-4">
            <el-button type="text" @click="goToEdit('AccountEdit', { id: scope.row.id })">编辑</el-button>
            <el-button type="text" @click="goToDetail('AccountDetail', { id: scope.row.id })">详情</el-button>
            <el-button
              type="text"
              v-if="scope.row.status === 0"
              @click="enableAccount({ id: scope.row.id })"
              >启用</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.status === 1"
              @click="disableAccount({ id: scope.row.id })"
              >禁用</el-button
            >
            <!-- <el-button type="text" @click="topAccount({ id: scope.row.id })"
              >置顶</el-button
            > -->
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, inject, watchEffect } from 'vue'
import {
  getAccountList as getAccountListApi,
  enableAccount as enableAccountApi,
  // topAccount as topAccountApi,
  disableAccount as disableAccountApi
} from '@/api/account'
import { getStatusDotColor, getStatusDotText } from '@/hooks/table'
import { routerPush } from '@/router'
import { ElMessage } from 'element-plus'

const goToDetail = (name, params) => {
  window.localStorage.setItem('currentAccountId', params.id)
  routerPush({ name })
}
const goToEdit = (name, params) => {
  window.localStorage.setItem('currentAccountId', params.id)
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

const getAccountList = async () => {
  const params = page
  const { data } = await getAccountListApi(formData.value, params)
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

//
// const tableLoading = ElLoading.service({
//   target: document.querySelector('#adPostionTable'),
//   fullscreen: false,
//   lock: true
// })
watchEffect(async () => {
  // console.log('watchEffect')

  const params = page
  const { data } = await getAccountListApi(formData.value, params)
  const { pager, list } = data
  tableData.value = list
  const pageResult = {
    page: pager.pageNo,
    total: pager.totalCount,
    limit: pager.pageSize
  }
  emit('listChange', { page: pageResult })
})

// const tableRef = ref()

// 操作
const enableAccount = async ({ id }) => {
  await enableAccountApi({ batchId: [id] })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getAccountList()
}

const disableAccount = async ({ id }) => {
  await disableAccountApi({ batchId: [id] })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getAccountList()
}
// const topAccount = async ({ id }) => {
//
//     await topAccountApi({ id })
//     ElMessage({
//       type: 'success',
//       message
//     })
//     getAccountList()
//   } catch (error) {
//     // console.log(error)
//   }
// }
defineExpose({
  refreshList: getAccountList
})
</script>
