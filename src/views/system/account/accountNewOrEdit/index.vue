<template>
  <div class="new-or-edit">
    <h1>{{ title }}</h1>
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="form"
      label-width="100px"
      label-position="right"
      :hide-requiredd-asterisk="false"
    >
      <el-form-item label="帐户编号：" v-if="!isAdd">
        {{ form.id }}
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input
          v-model.trim="form.name"
          type="text"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="登录账号：" prop="loginName">
        <el-input
          :readonly="!isAdd"
          v-model.trim="form.loginName"
          type="text"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="登录密码：" prop="newPassword" v-if="isAdd">
        <el-input
          v-model.trim="form.newPassword"
          type="password"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <div class="form-tips">
        密码位数为6-16个字符，区分大小写，支持字母（a-z，A-Z）、数字（0-9）及“_~@#$^”符号
      </div>
      <el-form-item label="确认密码：" prop="confirmPassword" v-if="isAdd">
        <el-input
          v-model.trim="form.confirmPassword"
          type="password"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="密码：" prop="editNewPassword" v-if="!isAdd">
        <el-button type="text" @click="openChangePasswordDialog"
          >修改密码</el-button
        >
      </el-form-item>
      <el-form-item label="部门：" prop="organizationId">
        <el-select v-model="form.organizationId" placeholder="请选择" clearable>
          <el-option
            v-for="option in dictList.companySelectList"
            :key="option.id"
            :label="option.label"
            :value="option.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="系统角色：" prop="roleList">
        <!-- <el-input v-model="selectRoleLabel" placeholder="请选择" readonly clearable @click="addRoles">
        </el-input> -->
        <el-tag
          v-for="role in form.roleList"
          :key="role.id"
          class="mr-5"
          closable
          :disable-transitions="false"
          @close="tagHandleClose(role)"
        >
          {{ role.name }}
        </el-tag>
        <el-button class="button-new-tag ml-1" size="small" @click="addRoles">
          + 增加角色
        </el-button>
      </el-form-item>
      <el-form-item label="入职时间：" prop="joinTime">
        <el-date-picker
          v-model="form.joinTime"
          type="date"
          :value-format="'YYYY-MM-DD HH:mm:ss'"
          clearable
        />
      </el-form-item>
      <el-form-item label="联系方式：" prop="phone">
        <el-input
          v-model="form.phone"
          type="text"
          placeholder="请输入"
          clearable
        />
      </el-form-item>
      <el-form-item label="备注：" prop="memo">
        <el-input
          v-model="form.memo"
          type="textarea"
          placeholder="请输入"
          clearable
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="启用状态：" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </el-form-item>
    </el-form>
    <ChooseRoleDialog
      ref="chooseRoleDialog"
      @select-change="selectChange"
    ></ChooseRoleDialog>
    <ResetPasswordDialog
      ref="resetPasswordDialog"
      :current-id="id"
      :action="updateAccountPassword"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, unref, onMounted, computed, watchEffect, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAccountDetail,
  updateAccount as updateAccountApi,
  addAccount as addAccountApi,
  updateAccountPassword
} from '@/api/account'
import store from '@/store'
import ChooseRoleDialog from './components/ChooseRoleDialog'
import ResetPasswordDialog from '@/components/ResetPasswordDialog.vue'
import { ValidatePassword, ValidateLoginName } from '@/utils'
import { getLengthValidHook } from '@/hooks/form'
const route = useRoute()
const router = useRouter()
const EDIT_ACCOUNT_TITLE = '账户信息编辑'
const ADD_ACCOUNT_TITLE = '账户信息新增'
const title = ref('')
const type = ref('')
const isAdd = computed(() => {
  return type.value === 'add'
})
const id = computed(() => {
  return window.localStorage.getItem('currentAccountId')
})
onMounted(() => {
  init()
})
function init () {
  type.value = route.meta.type || ''
  title.value = type.value === 'add' ? ADD_ACCOUNT_TITLE : EDIT_ACCOUNT_TITLE
}

const dictList = reactive({
  companySelectList: []
})
const initDict = async () => {
  const { companySelectList } = await store.dispatch(
    'dict/getCompanySelectList'
  )
  dictList.companySelectList = companySelectList
}
initDict()

const form = ref({
  id: '',
  name: '',
  loginName: '',
  newPassword: '',
  confirmPassword: '',
  organizationId: '',
  roleList: [],
  joinTime: '',
  phone: '',
  memo: '',
  status: 1
})

const ruleFormRef = ref()
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码位数为6-16个字符'))
  } else if (!ValidatePassword(value)) {
    callback(new Error('仅支持字母（a-z，A-Z）、数字（0-9）及“_~@#$^”符号'))
  } else {
    if (form.value.confirmPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== form.value.newPassword) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}
const roleValidator = (rule, value, callback) => {
  if (form.value.roleList.length === 0) {
    callback(new Error('请添加系统角色'))
  } else {
    if (!ruleFormRef.value) return
    ruleFormRef.value.validateField('checkPass', () => null)
    callback()
  }
}
const rules = reactive({
  newPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
  name: [{ required: true, trigger: 'blur', message: '请输入名称' }, getLengthValidHook()],
  loginName: [{ required: true, trigger: 'blur', message: '请输入登录账号' },
    { validator: (r, v) => ValidateLoginName(v), message: '登录账号规则：英文字母+数字,长度大于1', trigger: 'blur' }],
  organizationId: [{ required: true, trigger: 'blur', message: '请选择部门' }],
  roleList: [{ required: true, trigger: 'blur', validator: roleValidator }],
  phone: [
    getLengthValidHook()
  ]
})

// dialog
const resetPasswordDialog = ref()
const openChangePasswordDialog = () => {
  if (resetPasswordDialog.value) {
    resetPasswordDialog.value.open()
  }
}
// 选择角色逻辑
const chooseRoleDialog = ref()
const selectChange = (roleSelectList) => {
  roleSelectList.forEach((roleSel) => {
    if (form.value.roleList.every((role) => role.id !== roleSel.id)) {
      form.value.roleList.push(roleSel)
    }
  })
}
const roleIdList = computed(() => form.value.roleList.map((role) => role.id))
const addRoles = () => {
  if (chooseRoleDialog.value) {
    chooseRoleDialog.value.toggleDialog()
  }
}
const tagHandleClose = ({ id }) => {
  form.value.roleList = form.value.roleList.filter((role) => role.id !== id)
}
const onSubmit = () => {
  if (!ruleFormRef.value) return
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (isAdd.value) {
        addAccount()
      } else {
        updateAccount()
      }
    } else {
      return false
    }
  })
}

const getParams = () => {
  const {
    id,
    name,
    loginName,
    newPassword,
    confirmPassword,
    organizationId,
    joinTime,
    phone,
    memo,
    status
  } = unref(form.value)
  if (isAdd.value) {
    return {
      name,
      loginName,
      newPassword,
      confirmPassword,
      organizationId,
      roleIdList: roleIdList.value,
      joinTime,
      phone,
      memo,
      status
    }
  }
  return {
    id,
    name,
    loginName,
    organizationId,
    roleIdList: roleIdList.value,
    joinTime,
    phone,
    memo,
    status
  }
}

const addAccount = async () => {
  const params = getParams()
  await addAccountApi(params)
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  router.replace({ name: 'Account' })
}

const updateAccount = async () => {
  const params = getParams()
  await updateAccountApi(params)
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  router.replace({ name: 'Account' })
}

watchEffect(async () => {
  if (id.value) {
    const search = { id: id.value }
    const { data } = await getAccountDetail(search)
    form.value = data.userInformation
    form.value.roleList = data.roleNameList.map((role, index) => ({
      name: role,
      id: data.roleIdList[index]
    }))
    form.value.organizationId = data.department.id
  }
})
</script>

<style lang="scss" scoped>
.new-or-edit {
  padding: 0 20px;
  h1 {
    padding: 0px;
    margin: 10px 0;
    font-size: 26px;
    text-align: left;
  }
  .el-form {
    max-width: 500px;
    .form-tips {
      margin: 0 0 30px 100px;
      text-align: left;
      height: 20px;
      line-height: 20px;
      color: var(--el-text-color-secondary);
      font-size: var(--el-font-size-small);
    }
  }
}
</style>
