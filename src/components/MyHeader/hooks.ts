import { ref, reactive, onMounted } from 'vue'
import { useRenderer } from '@/composables/useBridge'
import type { CallBackFn, ClearAllFn, ListItem, ShareData, DropdownConfig, ContextmenuReturn, MoveReturn, Modal } from './types'

/**
 * 鼠标右击
 * @param { ShareData } 共享数据
 * @return { useContextmenuReturn } 返回数据
 */
export const useContextmenu = ({ menuList, onClearAll, onHideDropdown }: ShareData): ContextmenuReturn => {
  const { ipcRenderer } = useRenderer()

  /**
   * 下拉列表
   */
  const dropdownList = ref<ListItem[]>([
    {
      label: '最大化',
      value: 'maximize',
      action() {
        ipcRenderer.invoke(this.value)
      }
    },
    {
      label: '最小化',
      value: 'minimize',
      action() {
        ipcRenderer.invoke(this.value)
      }
    },
    {
      label: '关闭',
      value: 'quit',
      shortcut: 'Alt + F4',
      action() {
        ipcRenderer.invoke(this.value)
      }
    }
  ])

  /**
   * 下拉框配置项
   */
  const dropdownConfig = ref<DropdownConfig>({
    visible: false,
    x: 0,
    y: 0
  })

  /**
   * 点击下拉框项
   */
  const onDropdownItem = (item: ListItem) => {
    dropdownConfig.value.visible = false
    item.action && item.action()
  }

  /**
   * 右击
   */
  const onContextmenu = (e: MouseEvent) => {
    onClearAll()
    dropdownConfig.value = {
      visible: true,
      x: `${e.clientX}px`,
      y: `${e.clientY}px`
    }
  }

  /**
   * 执行快捷键方法
   */
  const onShortcut = (list: ListItem[], value: string) => {
    const isAllExist = list.some(item => {
      let isExist: boolean | number | undefined = false
      if (item.shortcut === value) {
        isExist = true
        item.action && item.action()
      } else {
        isExist = item.children?.length && onShortcut(item.children, value)
      }
      return isExist
    })
    return isAllExist
  }

  onMounted(() => {
    document.addEventListener('click', () => {
      dropdownConfig.value.visible = false
      onClearAll()
    })
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      let key = e.key.toUpperCase()
      e.altKey && (key = `Alt + ${key}`)
      e.shiftKey && (key = `Shift + ${key}`)
      e.ctrlKey && (key = `Ctrl + ${key}`)
      !onShortcut(dropdownList.value, key) && onShortcut(menuList.value, key)
    })
    onHideDropdown(() => {
      dropdownConfig.value.visible = false
    })
  })

  return { dropdownList, dropdownConfig, onDropdownItem, onContextmenu }
}

/**
 * 菜单
 */
export const useMenu = () => {
  const { ipcRenderer } = useRenderer()
  let callBack: CallBackFn
  let onClearAll: ClearAllFn
  const aboutDrawer = ref({ visible: false, name: '', version: '' })
  const modal = reactive<Modal>({
    visible: false,
    title: '提示',
    type: '',
    cancelText: '',
    okButtonProps: { type: 'primary' },
    okText: '',
    content: ''
  })

  const onSelectFile = async () => {
    const path: string = await ipcRenderer.invoke('selectFile', { title: '选择要导入的压缩文件', filters: [{ name: 'zip', extensions: ['zip'] }] })
    // eslint-disable-next-line no-console
    console.info(path)
    await ipcRenderer.invoke('unzip', path)
  }

  const menuList = ref<ListItem[]>([
    {
      label: '导入',
      value: 'import',
      shortcut: 'I',
      action() {
        onClearAll()
        this.state = !this.state
      },
      children: [
        {
          label: '选择目标文件',
          value: 'import',
          action() {
            onSelectFile()
          }
        }
      ]
    }
  ])

  /**
   * 清空下拉框
   */
  onClearAll = (list = menuList.value) => {
    list.forEach(item => {
      item.state && (item.state = false)
      item.children?.length && onClearAll(item.children)
    })
  }

  /**
   * 点击菜单项
   */
  const onMenuItem = (item: ListItem) => {
    callBack()
    item.action && item.action()
  }

  /**
   * 点击菜单下拉项
   */
  const onMenuChildItem = (item: ListItem) => {
    onClearAll()
    item.action && item.action()
  }

  /**
   * 隐藏下拉框
   */
  const onHideDropdown = (cb: CallBackFn) => {
    callBack = cb
  }

  /**
   * 点击确定
   */
  const handleOk = async () => {
    if (modal.type === 'down') {
      ipcRenderer.invoke('open', 'https://www.baidu.com')
    }
    modal.visible = false
  }

  return { aboutDrawer, menuList, modal, onMenuItem, onMenuChildItem, onClearAll, onHideDropdown, handleOk }
}

/**
 * 窗口大小
 */
export const useResize = () => {
  const { ipcRenderer } = useRenderer()
  const resizeList = ref<ListItem[]>([
    {
      title: '最小化',
      iconName: 'icon-minus',
      value: 'minimize',
      action() {
        ipcRenderer.invoke(this.value)
      }
    },
    {
      title: '最大化',
      iconName: 'icon-maximize',
      value: 'maximize',
      action() {
        ipcRenderer.invoke(this.value)
      }
    },
    {
      title: '关闭',
      iconName: 'icon-Quit',
      value: 'quit',
      action() {
        ipcRenderer.invoke(this.value)
      }
    }
  ])

  return { resizeList }
}

/**
 * 移动
 * @returns { MoveReturn } 返回数据
 */
export const useMove = (): MoveReturn => {
  const { ipcRenderer } = useRenderer()

  /**
   * 鼠标按下
   */
  const onMousedown = () => {
    ipcRenderer.send('start')
    /**
     * 表达式声明移动事件
     */
    document.onmousemove = () => {
      ipcRenderer.send('move')
    }

    /**
     * 表达式声明抬起事件
     */
    document.onmouseup = () => {
      /**
       * 清理上次的移动事件
       */
      document.onmousemove = null
      /**
       * 清理上次的抬起事件
       */
      document.onmouseup = null
    }
  }

  return { onMousedown }
}
