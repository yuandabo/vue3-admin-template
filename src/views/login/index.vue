<template>
  <div class="login-body">
    <el-card class="login-container box-card">
      <div class="head">
        <!-- <img class="logo" :src="avatar" alt="秦丝物业管理系统logo" /> -->
        <div class="name">
          <h1 class="title">{{name}}</h1>
          <!-- <div class="tips">Vue3.0 后台管理系统</div> -->
        </div>
      </div>
      <el-form :rules="rules" :model="ruleForm" size="large" ref="loginForm" class="login-form" @keyup.enter="submitForm">
        <el-form-item label="" prop="username">
          <el-input type="text" v-model.trim="ruleForm.username" autocomplate=“new-password placeholder="账号">
            <template #prefix>
              <el-icon class="el-input__icon"><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input type="password" v-model.trim="ruleForm.password" autocomplate=“new-password placeholder="密码">
            <template #prefix>
              <el-icon class="el-input__icon"><key /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div> -->
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
          <!-- <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <footer class="login-footer">
    Copyright 2022 秦丝科技
  </footer>
</template>

<script setup>
import { computed, ref } from 'vue'
import store from '@/store'
import { ValidateLoginName } from '@/utils'
// const avatar = computed(() => store.getters.sysAvatar)
const name = computed(() => store.getters.sysName)
const loginForm = ref(null)
const ruleForm = ref({
  username: '',
  password: ''
})
const rules = ref({
  username: [
    { required: 'true', message: '请输入登录账号', trigger: 'blur' },
    { validator: (rule, val) => ValidateLoginName(val), message: '非法登录账号', trigger: 'blur' }
  ],
  password: [
    { required: 'true', message: '请输入登录密码', trigger: 'blur' }
  ]
})

const submitForm = async () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      await store.dispatch('user/login', {
        loginName: ruleForm.value.username,
        password: ruleForm.value.password
      })
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
.login-body {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #f0f2f5;
    height: 100%;
  /* background-image: linear-gradient(25deg, #077f7c, #3aa693, #5ecfaa, #7ffac2); */
}
.login-footer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: #606266;
}
.login-container {
  // padding: 20px 0 20px 0;
  width: 320px;
  // height: 350px;
  background-color: #fff;
  // border-radius: 5px;
  // box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 20px 0 20px 0;
}
.head img {
  width: 150px;
  // height: 100px;
  margin-right: 20px;
}
.head .title {
  font-size: 26px;
  color: #303133;
  font-weight: 500;
}
.head .tips {
  font-size: 12px;
  color: #999;
}
.login-form {
  width: 90%;
  margin: 0 auto;
  .el-form-item {
    margin-bottom: 17px;
  }
  .el-input--large :deep(.el-input__prefix) {
    left: 12px;
  }
}
.el-form--label-top .el-form-item__label {
  padding: 0;
}
</style>
