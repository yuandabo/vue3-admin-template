<template>
  <div class="new-or-edit">
    <h1>{{title}}</h1>
    <el-form :model="form"
              :rules="rules"
             label-width="100px"
             label-position="right"
             ref="ruleFormRef">
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="form.memo" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="启用状态：">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <!-- <el-form-item label="权限："> -->
      <RoleTree v-bind="roleList" @role-tree-change="roleTreeChange"></RoleTree>
      <!-- </el-form-item> -->
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import store from '@/store'
import { ElMessage } from 'element-plus'
import { ref, unref, computed, watchEffect, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRoleDetail, updateRole as updateRoleApi, addRole as addRoleApi, getRoleMenuList as getRoleMenuListApi } from '@/api/role'
import RoleTree from '../components/RoleTree.vue'
import { getRequiredValidHook, getLengthValidHook } from '@/hooks/form'
const route = useRoute()
const router = useRouter()
const EDIT_ROLE_TITLE = '编辑角色'
const ADD_ROLE_TITLE = '新增角色'
const title = ref('')
const type = ref('')
const isAdd = computed(() => {
  return type.value === 'add'
})
const id = computed(() => {
  if (isAdd.value) {
    return ''
  } else {
    return window.localStorage.getItem('currentRoleId')
  }
})
// onMounted(() => {
// })
const roleList = reactive({
  rolePermission: [],
  existRolePermission: [],
  isReadOnly: false
})
watchEffect(async () => {
  if (!id.value) return
  const search = { id: id.value }
  const { data } = await getRoleDetail(id.value ? search : {})
  form.value = data.roleInformation
  roleList.existRolePermission = data.existRolePermission
})

function init () {
  type.value = route.meta.type || ''
  title.value = type.value === 'add' ? ADD_ROLE_TITLE : EDIT_ROLE_TITLE
}
init()

const form = ref({
  id: '',
  memo: '',
  status: 1,
  name: ''
})
const rules = reactive({
  name: [getRequiredValidHook(), getLengthValidHook()]
})
const ruleFormRef = ref()

const onSubmit = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (isAdd.value) {
        addRole()
      } else {
        updateRole()
      }
    } else {
      return false
    }
  })
}
const roleTreeId = ref([])
const roleTreeChange = (val) => {
  roleTreeId.value = val
}

const getRoleMenuList = async () => {
  const { data } = await getRoleMenuListApi()
  roleList.rolePermission = data
}
getRoleMenuList()

const getParams = () => {
  const { status, id, memo, name } =
    unref(form.value)
  const batchId = roleTreeId.value
  if (isAdd.value) {
    return {
      status, memo, batchId, name
    }
  }
  return {
    status, id, memo, batchId, name
  }
}

const addRole = async () => {
  const params = getParams()
  await addRoleApi(params)
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  router.replace({ name: 'Role' })
}

const updateRole = async () => {
  const params = getParams()
  await updateRoleApi(params)
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  await store.dispatch('user/getInfo', true)
  router.replace({ name: 'Role' })
}
</script>

<style lang="scss" scoped>
.new-or-edit {
  // height: calc(100vh - 84px);
  padding: 0 20px 20px;
  // overflow: auto;
  h1 {
    padding: 0px;
    margin: 10px 0;
    font-size: 26px;
    text-align: left;
  }
  .el-form {
    max-width: 900px;
  }
}
</style>
