/**
 * @file 初始化程序
 */
import { app, BrowserWindow } from 'electron'
import { createWindow } from './hooks/window'

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    !BrowserWindow.getAllWindows().length && createWindow()
  })
})

app.on('window-all-closed', () => {
  process.platform !== 'darwin' && app.quit()
})

/**
 * 忽略警告
 */
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
