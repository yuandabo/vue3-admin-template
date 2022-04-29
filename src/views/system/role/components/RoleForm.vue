<template>
  <el-form ref="formRef"
           :model="form"
           inline
           label-position="left"
           @keyup.enter="search">
    <el-form-item label="角色名：" prop="name">
      <el-input v-model="form.name"
                placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="状态：" prop="status">
      <el-select v-model="form.status" placeholder="请选择" clearable>
        <el-option
          v-for="option in statusList"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>
    <div class="form-button el-form-item--default el-form-item">
      <el-button type="primary" @click="search">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { NORMAL_STATUS_LIST } from '@/hooks/form'
const formRef = ref()
const form = reactive({
  name: '',
  status: ''
})
const statusList = computed(() => {
  return NORMAL_STATUS_LIST()
})
const emit = defineEmits(['search'])
const search = function () {
  const { name, status } = form
  emit('search', { name, status })
}
const reset = function () {
  formRef.value.resetFields()
  search()
}
</script>
