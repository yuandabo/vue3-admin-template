<template>
  <div>
    <header class="header">
      <h1>账号详情</h1>
      <div>
        <el-button type="primary" @click="goToEdit">编辑</el-button>
      </div>
    </header>
    <div class="content">
      <div class="shop-detail">
        <h2>账号信息</h2>
        <el-row :gutter="20">
          <el-col class="shop-detail-col"
                  :span="8">
            <div>编号：{{detail.id}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>名称：{{detail.name}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>编辑时间：{{detail.updateTime}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col class="shop-detail-col"
                  :span="8">
            <div>状态：<span class="dot"
                :style="{ backgroundColor: getStatusDotColor(detail.status) }"></span>
                {{getStatusDotText(detail.status)}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>登录账号：{{detail.loginName}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>部门：{{detail.departmentName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col class="shop-detail-col"
                  :span="8">
            <div>联系方式：{{detail.phone}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>系统角色：{{detail.roleNameListLabel}}</div>
          </el-col>
          <el-col class="shop-detail-col"
                  :span="8">
            <div>入职时间：{{detail.joinTime}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col class="shop-detail-col"
                  :span="8">
            <div>备注：{{detail.memo}}</div>
          </el-col>
        </el-row>
      </div>
      <!-- <div class="stall-lease-information">
        <h2>档口租赁信息</h2>
        <el-divider></el-divider>
        <AccManageDetailTable></AccManageDetailTable>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { getStatusDotColor, getStatusDotText } from '@/hooks/table'
import { routerPush } from '@/router'
import { getAccountDetail as getAccountDetailApi } from '@/api/account'
// 数据初始话
const detail = ref({
  roleNameListLabel: '',
  memo: '',
  joinTime: '',
  phone: '',
  departmentName: '',
  loginName: '',
  status: '',
  updateTime: '',
  name: '',
  id: ''
})
const id = computed(() => {
  return window.localStorage.getItem('currentAccountId')
})
// 跳转
const goToEdit = () => {
  routerPush({ name: 'AccountEdit' })
}
// 获取数据
const getAccountDetail = async () => {
  const search = { id: id.value }
  const { data } = await getAccountDetailApi(search)
  const { userInformation, roleNameList, department, id: userId } = data
  detail.value = userInformation
  detail.value.id = userId
  detail.value.departmentName = department?.label
  detail.value.roleNameListLabel = roleNameList?.toString()
}
watch(id, () => { getAccountDetail() }, { immediate: true })
</script>

<style lang="scss" scoped>
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
