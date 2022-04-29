<template>
  <el-form class="roleForm"
           :model="roleForm"
           label-width="60px">
    <el-form-item label="权限">
      <el-checkbox-group v-model="roleResources"
                         :disabled="props.isReadOnly"
                         class="auth-checkbox-group"
                         @change="authorityChangeHandler">
        <table class="auth-table">
          <tr class="auth-table-header">
            <td>一级</td>
            <td>二级</td>
            <td>权限配置细则</td>
          </tr>
          <tbody v-for="role in roleTreeData"
                 :key="role.id">
            <tr v-for="(subRole, index) in role.children"
                :key="subRole.id">
              <td v-if="index===0"
                  :rowspan="role.children.length">
                <el-checkbox :label="role.id" @change="checkboxChange($event, role.id)">{{ role.label }}</el-checkbox>
              </td>
              <td>
                <div>
                  <el-checkbox :label="subRole.id" @change="checkboxChange($event, subRole.id)">
                    {{ subRole.label }}
                  </el-checkbox>
                </div>
              </td>
              <td>
                <template v-for="detailRole in subRole.children" :key="detailRole.id">
                  <el-checkbox :label="detailRole.id"
                               class="auth-checkbox"
                                @change="checkboxChange($event, detailRole.id)">
                    {{ detailRole.label }}
                  </el-checkbox>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed, reactive, ref, unref, watch } from 'vue'
const props = defineProps({
  rolePermission: {},
  existRolePermission: {},
  isReadOnly: {
    default: true
  }
})
const emits = defineEmits(['roleTreeChange'])
const getJsonTree = (data, parentId) => {
  if (!data) return
  const itemArr = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    if (node.parentId === parentId) {
      const newNode = { id: node.id, parentId: node.parentId, label: node.label, children: getJsonTree(data, node.id), type: node.type, idx: node.idx }
      itemArr.push(newNode)
    }
  }
  return itemArr
}
const roleTreeData = computed(() => getJsonTree(props.rolePermission))
const roleForm = reactive({
  roleName: '',
  remark: ''
})
const roleResources = ref([])
watch(props, (val) => {
  roleResources.value = val.existRolePermission?.map((v) => v.id)
  emits('roleTreeChange', unref(roleResources))
})
const currentCheckStatus = ref(true)
const cuurentCheckId = ref('')
const checkboxChange = (val, id) => {
  currentCheckStatus.value = val
  cuurentCheckId.value = id
}
const authorityChangeHandler = (list) => {
  setTimeout(function () {
    const id = cuurentCheckId.value
    if (id) {
      if (currentCheckStatus.value) { // 勾选
        const result = getParentAndChildrenId(id, roleTreeData.value, true) // 获取上级权限和下级权限
        for (let i = 0; i < result.length; i++) {
          if (!roleResources.value.includes(result[i])) {
            roleResources.value.push(result[i])
          }
        }
      } else { // 取消勾选
        const result = getParentAndChildrenId(id, roleTreeData.value, false) // 获取下级权限
        for (let i = 0; i < result.length; i++) {
          const index = roleResources.value.indexOf(result[i])
          if (index > -1) {
            roleResources.value.splice(index, 1)
          }
        }
      }
    }
    emits('roleTreeChange', roleResources.value)
  }, 200)
}
/**
* @description 获取当前权限的上级权限和下级权限的id
* @param id 当前权限的id
* @param list 权限列表
* @param returnParent 是否返回上级权限
* @param result 结果集
* @returns 返回上级权限和下级权限的id数组
*/
const getParentAndChildrenId = (id, list, returnParent = true, result = []) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      result.push(id)
      // 拿所有子权限
      const childrenList = [list[i].children] // 记录子权限数组
      while (childrenList.length) {
        const popChildren = childrenList.pop()
        for (let j = 0; j < popChildren.length; j++) {
          result.push(popChildren[j].id)
          if (popChildren[j].children && popChildren[j].children.length) {
            childrenList.push(popChildren[j].children)
          }
        }
      }
      return result
    }
    if (list[i].children && list[i].children.length) { // 如果有下级权限
      returnParent && result.push(list[i].id) // 需要返回上级权限则把上级权限id加到结果数组
      const children = getParentAndChildrenId(id, list[i].children, returnParent, result) // 继续向下找
      if (children) {
        return children
      }
    }
    if (returnParent && i === list.length - 1 && result.length) { // 找到最后一个元素扔没有找到目标id则回退
      result.pop()
    }
  }
}

// const saveRole = () => {}
</script>

<style lang="scss" scoped>
.roleForm {
  text-align: left;
  .auth-checkbox-group .el-checkbox.is-disabled .el-checkbox__label {
    color: #606266;
  }
  .auth-table {
    border-collapse: collapse;
    width: 100%;
    .auth-table-header {
      background-color: #f4f4f4;
      font-weight: bold;
      font-size: 14px;
    }
    td {
      height: 30px;
      padding: 0 10px;
      border: 1px solid #dedede;
      color: #606266;
    }
  }
  .auth-checkbox {
    margin-left: 0;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
      & + .sub-detail-auth {
        margin-left: 20px;
      }
    }
    .el-checkbox__input {
      height: 14px;
    }
    .el-checkbox__label {
      vertical-align: text-top;
      white-space: normal;
    }
  }
  .sub-detail-auth {
    font-size: 12px;
    color: #606266;
    .el-checkbox__input,
    .el-checkbox__inner {
      transform: scale(0.9);
    }
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>
