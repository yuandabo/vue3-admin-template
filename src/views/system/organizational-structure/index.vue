<template>
  <div class="organization">
    <!-- <el-input v-model="searchInput" placeholder="请输入" clearable @change="getOrganizationList">
      <template #suffix>
        <el-icon class="el-input__icon pointer" @click="getOrganizationList">
          <Search />
        </el-icon>
      </template>
    </el-input> -->
    <el-tree
      :data="dataSource"
      node-key="id"
      :props="defaultProps"
      :expand-on-click-node="false"
      accordion
      default-expand-all
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>
            <template v-if="data.edit">
              <el-input v-model="data.label" @blur="(event) => addTreeNode(node, data, event)" v-focus></el-input>
            </template>
            <span v-else>{{ data.label }}</span>
          </span>
          <span class="flex-center" @click.stop>
            <el-icon class="mlr-5 opreate-icon" :color="'#67c23a'" @click.stop="($event) => edit(node, data, $event)"><edit-pen /></el-icon>
            <el-icon class="mlr-5 opreate-icon" :color="'#f56c6c'" v-if="data.id !== 1" @click.stop="remove(node, data)"><minus /></el-icon>
            <el-icon class="mlr-5 opreate-icon" :color="'#409eff'" @click.stop="append(node, data)"><plus /></el-icon>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { getOrganizationList as getOrganizationListApi, addOrganization as addOrganizationApi, updateOrganization as updateOrganizationApi, deleteOrganization as deleteOrganizationApi } from '@/api/organization'
const searchInput = ref('')
let id = 1000

const operateType = ref('')
const currentEdit = ref({})

const edit = (node, data) => {
  currentEdit.value = data
  operateType.value = 'edit'
  currentParentNode.value = data
  data.edit = !data.edit
}

const dataSource = ref([])
const defaultProps = {
  children: 'children',
  label: 'label'
}

// const getParams = () => {}
const getOrganizationList = async () => {
  const { data } = await getOrganizationListApi({ label: searchInput.value })
  dataSource.value = getJsonTree(data)
  // console.log(dataSource.value)
  // dataSource.value = data
}
getOrganizationList()

const currentParentNode = ref({})
const append = (node, data, event) => {
  operateType.value = 'add'
  currentParentNode.value = data
  const newChild = { id: id++, label: '', children: [], edit: true }
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
}

const addTreeNode = async (val, nodeData, event) => {
  const label = val?.data?.label
  if (label?.length < 1 || label?.length > 30) {
    ElMessage({
      type: 'warning',
      message: '长度应该为1到30个字符'
    })
    // event.target.focus()
    return
  }
  if (operateType.value === 'add') {
    addOrganization(val, nodeData)
  } else if (operateType.value === 'edit') {
    updateOrganization(nodeData)
  }
  currentEdit.value = {}
}
const addOrganization = async (val, nodeData) => {
  const { label } = val.data

  const params = {
    label: label || '默认权限名',
    parentId: currentParentNode.value.id,
    idx: currentParentNode.value.idx
  }
  await addOrganizationApi(params)
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getOrganizationList()
}
const updateOrganization = async (nodeData) => {
  const params = {
    label: currentParentNode.value.label || '默认权限名',
    id: currentParentNode.value.id
  }
  await updateOrganizationApi(params)
  ElMessage({
    type: 'success',
    message: '操作成功'
  })
  getOrganizationList()
}
const remove = async (node, data) => {
  if (data.children?.length > 0) {
    ElMessage({
      type: 'warning',
      message: '当前节点有子节点无法删除，请先删除子节点'
    })
    return
  }
  const msgResult = await ElMessageBox.confirm('确认删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

  if (msgResult) {
    const params = { id: data.id }
    await deleteOrganizationApi(params)
    ElMessage({
      type: 'success',
      message: '操作成功'
    })
    getOrganizationList()
  }
}

const getJsonTree = function (data, parentId) {
  const itemArr = []
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    if (node.parentId === parentId) {
      const newNode = { id: node.id, label: node.label, children: getJsonTree(data, node.id), idx: node.idx }
      itemArr.push(newNode)
    }
  }
  return itemArr
}
</script>

<style lang="scss" scoped>
.organization {
  padding: 0 0 30px 0;
  text-align: left;
  width: 100%;
  // height: calc(100vh - 84px);
  // overflow: auto;
  .el-input {
    width: 500px;
  }
  .el-tree {
    width: 500px;
    background: transparent;
    :deep(.el-tree-node__content) {
      height: 30px;
      line-height: 30px;
    }
    .el-input {
      width: 200px;
      height: 28px;
      :deep(input) {
        height: 100%;
      }
    }
    .opreate-icon {
      font-size: 18px;
    }
    .custom-tree-node {
      height: 30px;
      line-height: 30px;
      display: flex;
      width: 500px;
      justify-content: space-between;
      font-size: 14px;
    }
  }
}
</style>
