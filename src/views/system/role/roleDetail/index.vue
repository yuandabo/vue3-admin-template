<template>
  <div class="roleDetail">
    <header class="header">
      <h1>角色详情</h1>
      <div>
        <el-button type="primary" @click="goToEdit('RoleEdit')">编辑</el-button>
        <el-button type="primary" @click="enableRole">启用</el-button>
        <el-button type="primary" @click="disableRole">禁用</el-button>
      </div>
    </header>
    <div class="content">
      <div class="shop-detail">
        <h2>角色信息</h2>
        <el-row :gutter="20">
          <el-col class="shop-detail-col"
                  :span="8">
            <div>角色编号：{{detail.id}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>角色名称：{{detail.name}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>新建时间：{{detail.updateTime}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col class="shop-detail-col"
                  :span="8">
            <div>状态：<span class="dot"
                :style="{ backgroundColor: getStatusDotColor(detail.status) }"></span>
                {{getStatusDotText(detail.status)}}</div>
          </el-col>
        </el-row>
      </div>
      <div class="stall-lease-information">
        <h2>角色权限</h2>
        <el-divider></el-divider>
        <RoleTree v-bind="roleList" :isReadOnly="true"></RoleTree>
      </div>
    </div>
  </div>
</template>

<script setup>
import { routerPush } from '@/router'
import { ElMessage } from 'element-plus'
import RoleTree from '../components/RoleTree.vue'
import {
  getRoleDetail,
  enableRole as enableRoleApi,
  disableRole as disableRoleApi
} from '@/api/role'
import { computed, reactive, ref } from 'vue'
import { getStatusDotColor, getStatusDotText } from '@/hooks/table'
const id = computed(() => {
  return window.localStorage.getItem('currentRoleId')
})

const goToEdit = (name) => {
  routerPush({ name })
}
//
const detail = ref({})
const roleList = reactive({
  rolePermission: [],
  existRolePermission: [],
  isReadOnly: false
})
//
const getDetial = async () => {
  if (id.value) {
    const search = { id: id.value }
    const { data } = await getRoleDetail(search)
    detail.value = data.roleInformation
    roleList.rolePermission = data.rolePermission
    roleList.existRolePermission = data.existRolePermission
  }
}
getDetial()
// 操作
const enableRole = async () => {
  await enableRoleApi({ batchId: [id.value] })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getDetial()
}
const disableRole = async () => {
  await disableRoleApi({ batchId: [id.value] })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getDetial()
}
</script>

<style lang="scss" scoped>
.roleDetail {
  // height: calc(100vh - 84px);
  // overflow: auto;
}
.header {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: var(--el-color-white);
  h1 {
    padding: 0px;
    margin: 10px 0;
    font-size: 26px;
  }
}
.content {
  margin: 20px;
  padding: 10px 20px;
  background: var(--el-color-white);
  text-align: left;
  h2 {
    margin: 10px 0 0 0;
    font-size: 20px;
  }
  .el-divider {
    margin: 5px 0 20px 0;
  }
  .shop-detail-col {
    padding: 10px 0;
  }
}
</style>
