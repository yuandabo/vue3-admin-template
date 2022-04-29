export const getIsTopText = (status) => {
  return status === 0 ? '否' : '是'
}
const ISTOP_DOTCOLOR = {
  0: '#f56c6c',
  1: '#67C23A',
  default: '#909399'
}
export const getTopDotColor = (status) => {
  return ISTOP_DOTCOLOR[Number(status)] || ISTOP_DOTCOLOR.default
}

// 获取缴费状态
const PAYDOTCOLOR = {
  0: '#f56c6c',
  1: '#67C23A',
  2: '#e6a23c',
  default: '#909399'
}
const PAYWORD = {
  0: '未缴费',
  1: '已缴费',
  2: '取消作废',
  default: ''
}
export const PAYFILTERLIST = [
  { text: '已缴费', value: '1' },
  { text: '未缴费', value: '0' },
  { text: '取消作废', value: '2' }
]
export const getPayStatusDotColor = (status) => {
  return PAYDOTCOLOR[Number(status)] || PAYDOTCOLOR.default
}
export const getPayStatusDotText = (status) => {
  return PAYWORD[Number(status)] || PAYWORD.default
}
