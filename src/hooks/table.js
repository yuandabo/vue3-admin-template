// 获取普通状态
export const getStatusDotColor = (status) => {
  return status === 1 ? '#67C23A' : '#909399'
}
export const getStatusDotText = (status) => {
  return status === 1 ? '启用' : '未启用'
}
// 获取关联状态
const RELATIONDOTCOLOR = {
  0: '#f56c6c',
  1: '#e6a23c',
  2: '#67C23A',
  default: '#909399'
}
const RELATIONWORD = {
  0: '待处理',
  1: '处理中',
  2: '已完成',
  default: '待处理'
}
export const RELATIONFILTERLIST = [
  { text: '处理中', value: '1' },
  { text: '待处理', value: '0' },
  { text: '已完成', value: '2' }
]
export const getRelationStatusDotColor = (status) => {
  return RELATIONDOTCOLOR[Number(status)] || RELATIONDOTCOLOR.default
}
export const getRelationStatusDotText = (status) => {
  return RELATIONWORD[Number(status)] || RELATIONWORD.default
}
// 表格动态高度
export const BOXHEIGHTCONST = {
  NAV: 84,
  PAGER: 54,
  PADDING: 40,
  OPREATE: 62
}
export const BOXHEIGHTCONSTSUM = BOXHEIGHTCONST.NAV + BOXHEIGHTCONST.PADDING + BOXHEIGHTCONST.PAGER
// 缴费
export const getPayStatusDotText = (status) => {
  return status === 1 ? '启用' : '停收'
}
