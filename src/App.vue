<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import { ElConfigProvider } from 'element-plus'
import store from '@/store'

import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default defineComponent({
  components: {
    ElConfigProvider
  },
  setup () {
    store.dispatch('sys/getSysInfo')
    return {
      locale: zhCn
    }
  }
})
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.sidebar-icon {
  // left: -3px;
  // position: relative;
}
</style>
