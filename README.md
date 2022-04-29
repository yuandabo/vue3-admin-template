# vue3-admin-template
vue3.0.0 + elementplus + webpack + es7 + vue-router + vuex
addRoute 配合后端节后动态加载路由、菜单鉴权。
无限加载选择框
自定义表格高度指令
富文本
树形选择器
权限配置树形表格
vuex字典数据持久化
函数调用自定义组件

// 踩坑
package.json.lock 文件导致测试环境打包失败
路由守卫角色权限
keep-alive 无效：
include 只能缓存第一级的组件，第二级的无法缓存。
使用 exclude 去除不需要缓存的组件

使用 setup 开发 没有给组件设置name属性，通过 vue-devtools 发现 name是 Index，所以缓存失效
解决：设置 name 的方法 1. https://www.csdn.net/tags/NtzaggxsMjkyNjItYmxvZwO0O0OO0O0O.html 2.https://zhuanlan.zhihu.com/p/481640259 
手动触发resize事件
vue-element-admin 面包屑报错：https://blog.csdn.net/a13145211/article/details/106207098/
生产环境莫名其妙报错： Uncaught TypeError: Cannot read properties of undefined (reading 'refs')
新增编辑用不同路由，切用本地缓存传递参数时，路由混乱的问题。
新增编辑详情路由跳转新增权限判断
(函数调用组件)生产环境）h 方法返回的vnode component 属性里面的 proxy 为undefind，需改为 exposed

element-plus
dialog弹出时 body 右侧出现 padding-right: 17px;
daterange 选择器打包在生产环境背景样式缺失
