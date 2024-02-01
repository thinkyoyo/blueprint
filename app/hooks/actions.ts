// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, Point, shell, BrowserWindow, dialog, OpenDialogOptions, clipboard, ipcMain } from 'electron'
import { spawn, exec, execSync } from 'child_process'
import { join } from 'path'
import { existsSync, mkdirSync, copyFileSync, cpSync } from 'fs'
// import Logger from 'bunyan'
// eslint-disable-next-line import/no-extraneous-dependencies
// import { exec } from 'sudo-prompt'
import packageJson from '../../package.json'
import type { AboutActionReturn, FnReturn, OpenWindowActionParam, ActionEvent } from '~/types'
import { createWindow } from './window'

/**
 * 主进程操作
 * @returns { Record<string, FnReturn> } 操作 API
 */
export const useActions = (): Record<string, FnReturn> => {
  // const logger = Logger.createLogger({ name: 'blueprint', stream: process.stdout })
  // const logger = appLog()
  const startCursorPoint: Point = { x: 0, y: 0 }
  const startWindowPoint: Point = { x: 0, y: 0 }
  const { name, version } = packageJson

  /**
   * 获取窗口
   */
  const getWindow = () => BrowserWindow.getFocusedWindow() as BrowserWindow

  /**
   * 打开网页
   */
  const openAction: ActionEvent<string> = (_, url: string) => {
    shell.openExternal(url)
  }

  /**
   * 最小化
   */
  const minimizeAction = () => {
    const window = getWindow()
    window.minimize()
  }

  /**
   * 最大化
   */
  const maximizeAction = () => {
    const window = getWindow()
    window.isMaximized() ? window.unmaximize() : window.maximize()
  }

  /**
   * 退出
   */
  const quitAction = () => {
    const window = getWindow()
    window.close()
  }

  /**
   * 移动开始点
   */
  const startAction = () => {
    // console.info('startAction')
    const window = getWindow()

    /**
     * 窗口坐标
     */
    const windowPoint = window.getPosition()
    // eslint-disable-next-line prefer-destructuring
    startWindowPoint.x = windowPoint[0]
    // eslint-disable-next-line prefer-destructuring
    startWindowPoint.y = windowPoint[1]

    /**
     * 鼠标坐标
     */
    const { x, y } = screen.getCursorScreenPoint()
    startCursorPoint.x = x
    startCursorPoint.y = y
  }

  /**
   * 移动
   */
  const moveAction = () => {
    // console.info('moveAction')
    const window = getWindow()
    const { x: sx, y: sy } = startCursorPoint
    const { x: wx, y: wy } = startWindowPoint
    const { x, y } = screen.getCursorScreenPoint()
    const cx = wx + x - sx
    const cy = wy + y - sy

    window.setPosition(cx, cy, true)
  }

  /**
   *  关于
   */
  const aboutAction = (): AboutActionReturn => ({ name, version })

  /**
   * 解压zip包
   */
  const unzipAction: ActionEvent<string> = async (_, myPath: string) => {
    // logger.info('========================================')
    // logger.info(myPath)
    console.log(myPath)
    const templateFilePath = join(process.cwd(), '/resources/extra')
    // const templateFilePath = join('C:\\Program Files\\blueprint', '/resources/extra')
    console.log(templateFilePath)
    const outputFilePath = join(templateFilePath, '/output/blueprint.png')
    console.log(outputFilePath)
    const unzipFilePath = join('C:\\blueprint', '/resources')
    console.log(unzipFilePath)
    const unzipOutputFilePath = join(unzipFilePath, '/output/blueprint.png')
    console.log(unzipOutputFilePath)
    // const cmd = `${templateFilePath}\\7zr.exe x ${myPath} -o${templateFilePath}\\output -aoa -p123456`
    const cmd = `"${templateFilePath}"\\7zr.exe x ${myPath} -o"${unzipFilePath}"\\output -aoa -p123456`
    // const cmd2 = `"${templateFilePath}"\\7zr.exe x ${myPath} -o"${templateFilePath}"\\output -aoa -p123456`
    // const arr = [`"${templateFilePath}"\\7zr.exe`, 'x', `${myPath}`, `-o"${unzipFilePath}"\\output`, '-aoa', '-p123456']
    console.log(cmd)
    const output = `${unzipFilePath}\\output`
    console.log(output)
    try {
      if (!existsSync(output)) {
        mkdirSync(output)
      }
    } catch (e) {
      console.log('mkdir error info')
      console.log(e)
      console.log('mkdir error')
    }
    try {
      console.log('unzip begin')
      // exec('C:\\electron\\unzip\\bin\\7zr.exe x C:\\electron\\THUCNews.zip -oC:\\electron\\output -aoa', unzipCallback)
      // exec('C:\\electron\\unzip\\bin\\7zr.exe x C:\\electron\\ico.zip -oC:\\electron\\output -aoa -p12345678', unzipCallback)
      execSync(cmd)
      // exec(cmd2)
      // cpSync(unzipOutputFilePath, outputFilePath)
      // const result = spawn('cmd.exe', arr, { stdio: 'inherit' })
      // execSync('C:\\electron\\unzip\\bin\\7zr.exe x C:\\electron\\ico.zip -oC:\\electron\\output -aoa -p123456')
      // execSync(cmd)
      // execSync('C:\\electron\\7zr.exe x C:\\electron\\THUCNews.zip -oC:\\electron\\output -aoa -p123456')
      // unzipEncryptZip(path, '123456', 'C:\\electron\\unzip')
      // const directory = await unzipper.Open.file(path)
      // const extracted = await directory.files[0].buffer('123456')
      // console.log(extracted.toString())
      console.log('unzip success')
    } catch (e) {
      console.log('unzip error info')
      console.log(e)
      console.log('unzip error')
    }
  }

  /**
   * 选择文件
   */
  const selectFileAction: ActionEvent<OpenDialogOptions> = async (_, { title, filters }: OpenDialogOptions) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title,
      filters,
      properties: ['openFile']
    })
    if (canceled || !filePaths.length) return
    return filePaths[0]
  }

  /**
   * 打开子窗口
   */
  const openWindowAction: ActionEvent<OpenWindowActionParam> = (_, { path }) => {
    createWindow(path)
  }

  /**
   * 复制到剪切板
   */
  const copyAction: ActionEvent<string> = (_, content: string) => {
    clipboard.writeText(content, 'clipboard')
    return content
  }

  const getFilePathAction: ActionEvent<string> = (_, content: string) => {
    const templateFilePath = join(process.cwd(), '/resources/extra')
    console.log(templateFilePath)
    const myPath = `${templateFilePath}`
    return myPath
  }

  return {
    openAction,
    minimizeAction,
    maximizeAction,
    quitAction,
    startAction,
    moveAction,
    aboutAction,
    unzipAction,
    selectFileAction,
    openWindowAction,
    copyAction,
    getFilePathAction
  }
}
