export const NORMAL_STATUS_LIST = () => [
  { label: '未启用', value: 0 },
  { label: '启用', value: 1 }
]

// 表单校验
export const getRequiredValidHook = (obj = { trigger: 'blur', message: '请输入' }) => {
  return { required: true, trigger: obj.trigger, message: obj.message }
}
export const getLengthValidHook = (obj = { max: 30, min: 1 }) => {
  return { max: obj.max, min: obj.min, trigger: 'blur', message: `长度应该为${obj.min}到${obj.max}个字符` }
}
export const getNumberValidHook = () => {
  return { type: 'number', trigger: 'blur', message: '请输入数字' }
}
