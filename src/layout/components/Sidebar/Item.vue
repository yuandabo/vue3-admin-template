<script>
import { h, resolveComponent } from 'vue'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render () {
    if (!this.icon) {
      return null
    }
    const icon = resolveComponent(this.icon)
    return h('i', { class: ['el-icon', 'el-icon-' + this.icon, 'sub-el-icon'] }, [
      h(icon, { class: 'sidebar-icon' })
    ])
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
