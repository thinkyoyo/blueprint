import type { LazyVue, RouteItem } from './types'

const templateComponent: LazyVue = () => import('../views/layout/template.vue')
const modules = import.meta.glob('../views/**/*.vue')

/**
 * 路由配置
 */
const routes: RouteItem[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    meta: {
      title: '首页',
      antIcon: 'HomeOutlined'
    }
  },
  {
    path: 'tools',
    meta: {
      title: '工具',
      antIcon: 'ToolOutlined'
    },
    redirect: { name: 'tools-my-test' },
    children: [
      {
        path: 'my-test',
        name: 'tools-my-test',
        meta: {
          title: '测试页面'
        }
      }
    ]
  }
]

const addComponents = (list: RouteItem[], parentPath?: string) => {
  list.forEach(item => {
    if (item.children) {
      item.component = templateComponent
      addComponents(item.children, item.path)
    } else if (!item.component) {
      const path = (parentPath ? `${parentPath}/` : '') + item.path
      item.component = modules[`../views/${path}/index.vue`] as LazyVue
    }
  })
}
addComponents(routes)

export default routes
