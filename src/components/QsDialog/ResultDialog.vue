<template>
  <el-dialog v-model="dialogVisible" :title="props.title" width="30%">
    <el-form
      ref="resultFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item :label="`${props.label}：`" prop="result">
        <el-input
          v-model="ruleForm.result"
          placeholder="不超过140字"
          type="textarea"
          clearable
          maxlength="140"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitResult">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
const props = defineProps({
  title: {
    type: String,
    default: '回复'
  },
  label: {
    type: String,
    default: '回复内容：'
  },
  actions: {
    type: Function,
    required: true
  }
})
const dialogVisible = ref(false)
const ruleForm = reactive({
  result: ''
})
const rules = {
  result: [
    { required: true, message: `请输入${props.label}`, trigger: 'blur' },
    { max: 140, message: '最多140个文字', trigger: 'blur' }
  ]
}
const resultFormRef = ref()
const submitResult = () => {
  resultFormRef.value.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false
      const { result } = ruleForm
      props.actions({ result })
      resultFormRef.value.resetFields()
    } else {
      ElMessage({
        type: 'error',
        message: `请输入${props.label}`
      })
    }
  })
}
const open = () => {
  dialogVisible.value = true
}
defineExpose({
  open
})
</script>
