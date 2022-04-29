import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  name: 'SystemManage',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: '系统设置',
    icon: 'tools'
  },
  children: [
    {
      path: 'personal',
      meta: {
        title: '个人中心',
        whiteMenu: true
      },
      name: 'SystemPersonal',
      component: () => import('@/views/system/personal-center/index.vue')
    },
    {
      path: 'account',
      name: 'Account',
      meta: {
        title: '账号管理'
      },
      component: () => import('@/views/system/account/index.vue')
    },
    {
      path: 'account-new',
      name: 'AccountAdd',
      meta: {
        title: '新增账号',
        type: 'add',
        noTag: true,
        activeMenu: '/system/account'
      },
      hidden: true,
      component: () => import('@/views/system/account/accountNewOrEdit/index.vue')
    },
    {
      path: 'account-edit',
      name: 'AccountEdit',
      meta: {
        title: '编辑账号',
        type: 'edit',
        noTag: true,
        activeMenu: '/system/account'
      },
      hidden: true,
      component: () => import('@/views/system/account/accountNewOrEdit/index.vue')
    },
    {
      path: 'account-detail',
      name: 'AccountDetail',
      meta: {
        title: '账号详情',
        activeMenu: '/system/account'
      },
      hidden: true,
      component: () => import('@/views/system/account/accountDetail/index.vue')
    },
    {
      path: 'role',
      name: 'Role',
      meta: {
        title: '角色权限'
      },
      component: () => import('@/views/system/role/index.vue')
    },
    {
      path: 'role-detail',
      name: 'RoleDetail',
      meta: {
        title: '角色详情',
        activeMenu: '/system/role'
      },
      hidden: true,
      component: () => import('@/views/system/role/roleDetail/index.vue')
    },
    {
      path: 'role-new',
      name: 'RoleAdd',
      meta: {
        title: '新增角色',
        type: 'add',
        noTag: true,
        activeMenu: '/system/role'
      },
      hidden: true,
      component: () => import('@/views/system/role/roleNewOrEdit/index.vue')
    },
    {
      path: 'role-edit',
      name: 'RoleEdit',
      meta: {
        title: '编辑角色',
        type: 'edit',
        noTag: true,
        activeMenu: '/system/role'
      },
      hidden: true,
      component: () => import('@/views/system/role/roleNewOrEdit/index.vue')
    },
    {
      path: 'company',
      name: 'SystemCompany',
      meta: {
        title: '组织架构'
      },
      component: () => import('@/views/system/organizational-structure/index.vue')
    }
  ]
}

export default systemRouter
