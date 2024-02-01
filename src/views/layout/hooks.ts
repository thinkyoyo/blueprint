import { ref } from 'vue'
import type { SideBarExpose } from '@/components/MySideBar/types'

export const useLayout = () => {
  const sidebarRef = ref<SideBarExpose>()
  const isCollapsed = ref(false)

  return { sidebarRef, isCollapsed }
}
