import { h, render } from 'vue'
import ResultDialog from './ResultDialog.vue'

const boxId = 'dialog-global'

const renderBox = (props) => {
  const container = document.createElement('div')
  container.id = boxId
  // 创建 虚拟dom
  const boxVNode = h(ResultDialog, props)
  // 将虚拟dom渲染到 container dom 上
  render(boxVNode, container)
  // 最后将 container 追加到 body 上
  const oldDialog = document.querySelector('#dialog-global')
  if (oldDialog) document.body.removeChild(oldDialog)
  document.body.appendChild(container)
  return boxVNode
}

let boxInstance

const QsDialog = (props) => {
  // if (boxInstance) {
  //   const boxVue = boxInstance.component
  //   // 调用上述组件中定义的open方法显示弹框
  //   // 注意不能使用boxVue.ctx来调用组件函数（build打包后ctx会获取不到）
  //   boxVue.exposed.open(props)
  // } else {
  //   boxInstance = renderBox(props)
  //   QsDialog(props)
  // }
  boxInstance = renderBox(props)
  const boxVue = boxInstance.component
  // 调用上述组件中定义的open方法显示弹框
  // 注意不能使用boxVue.ctx来调用组件函数（build打包后ctx会获取不到）
  boxVue.exposed.open(props)
}

export default QsDialog
