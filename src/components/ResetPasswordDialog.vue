<template>
  <teleport to="#dialog">
    <el-dialog v-model="dialogVisible" title="修改密码" width="500px">
      <el-form
        ref="ruleFormRef"
        class="form"
        :model="form"
        label-position="top"
        :rules="rules"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            placeholder="输入新密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <div class="form-tips">
          密码位数为6-16个字符，区分大小写，支持字母（a-z，A-Z）、数字（0-9）及“_~@#$^”符号
        </div>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            placeholder="请输入"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >确定</el-button
          >
          <el-button @click="cancel">取消</el-button></span
        >
      </template>
    </el-dialog>
  </teleport>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ValidatePassword } from '@/utils'
const props = defineProps({
  currentId: {
    require: true
  },
  action: {
    type: Function,
    require: true
  }
})

const form = reactive({
  newPassword: '',
  confirmPassword: ''
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
    if (form.confirmPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('confirmPassword', () => null)
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
  newPassword: [{ validator: validatePass, trigger: 'blur', required: true }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur', required: true }]
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
const cancel = () => {
  ruleFormRef.value.resetFields()
  dialogVisible.value = false
}

const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
}

const updatePassword = async () => {
  const { newPassword, confirmPassword } = form
  await props.action({
    newPassword,
    confirmPassword,
    id: props.currentId
  })
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  dialogVisible.value = false
  ruleFormRef.value.resetFields()
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.form-button {
  position: relative;
  top: 30px;
  text-align: right;
}
.form-tips {
  margin-bottom: 30px;
  text-align: left;
  height: 20px;
  line-height: 20px;
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}
</style>
