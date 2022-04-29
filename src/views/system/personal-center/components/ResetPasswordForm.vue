<template>
  <el-form ref="ruleFormRef"
           class="form"
           :model="form"
           label-position="top"
           :rules="rules">
    <el-form-item label="当前密码" prop="password">
      <el-input v-model="form.password"
                placeholder="输入当前密码"
                type="password"
                show-password></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="form.newPassword"
                placeholder="输入新密码"
                type="password"
                show-password></el-input>
      <!-- <div class="tip">密码长度最少为6位</div> -->
    </el-form-item>
    <div class="form-tips">
      密码位数为6-16个字符，区分大小写，支持字母（a-z，A-Z）、数字（0-9）及“_~@#$^”符号
    </div>
    <el-form-item label="确认新密码" prop="confirmPassword">
      <el-input v-model="form.confirmPassword"
                placeholder="请输入"
                type="password"
                show-password></el-input>
    </el-form-item>
    <div class="form-button el-form-item--default el-form-item">
      <el-button type="primary"
                 @click="submitForm(ruleFormRef)">确定</el-button>
      <el-button @click="props.closeDialog()">取消</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { updatePassword as updatePasswordApi } from '@/api/user'
import { ElMessage } from 'element-plus'
import { ValidatePassword } from '@/utils'
import store from '@/store'
const props = defineProps({
  closeDialog: {
    type: Function,
    required: true
  },
  currentId: {
    require: true
  }
})

const form = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const ruleFormRef = ref()

const validateCurrentPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 6 || value.length > 16) {
    callback(new Error('密码位数为6-16个字符'))
  } else if (!ValidatePassword(value)) {
    callback(new Error('仅支持字母（a-z，A-Z）、数字（0-9）及“_~@#$^”符号'))
  } else {
    if (form.newPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive({
  password: [{ validator: validateCurrentPass, trigger: 'blur' }],
  newPassword: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
})

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      updatePassword()
    } else {
      return false
    }
  })
}

const updatePassword = async () => {
  const { password, newPassword, confirmPassword } = form
  await updatePasswordApi({ password, newPassword, confirmPassword, id: props.currentId })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  props.closeDialog()
  ruleFormRef.value.resetFields()
  store.dispatch('user/logout')
}
</script>

<style lang="scss" scoped>
.form-button {
  position: relative;
  top: 30px;
  text-align: right;
}
.form-tips {
  margin: 0 0 30px 0;
  text-align: left;
  height: 20px;
  line-height: 20px;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}
</style>
