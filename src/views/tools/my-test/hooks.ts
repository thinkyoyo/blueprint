import { ref } from 'vue'
import { message, Form } from 'ant-design-vue'
import { myTestApi } from '@/api/my-test'
import { useRenderer } from '@/composables/useBridge'
// import { appLog } from '@/utils/logger'

/**
 * 新增/修改表单
 */
export const useForm = () => {
  // const logger = appLog()
  const { ipcRenderer } = useRenderer()
  const origin = Object.freeze('http://www.baidu.com/')
  const myTest = ref('待复制的信息')

  /**
   * 表单
   */
  const formState = ref({
    content: ''
  })

  const rules = ref({
    content: [{ required: true, message: '请输入 URL 地址' }]
  })

  const { validate, validateInfos } = Form.useForm(formState, rules)

  const onGetFilePath = async () => {
    const myPath = await ipcRenderer.invoke('getFilePath', myTest.value)
    message.success(myPath)
  }

  const onSubmit = async () => {
    await validate()
    const data = await myTestApi.create(formState.value)
    myTest.value = origin + data.link
    message.success('操作成功')
  }

  const onCopy = async () => {
    // logger.info('onCopy===============================')
    const myCopy = await ipcRenderer.invoke('copy', myTest.value)
    message.success(`复制成功:${myCopy}`)
  }

  return { formState, validateInfos, onSubmit, myTest, onCopy, onGetFilePath }
}
