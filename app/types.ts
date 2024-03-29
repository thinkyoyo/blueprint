// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcMain, BrowserWindow, IpcMainInvokeEvent } from 'electron'

/**
 * handleChannels item
 */
export interface HandleChannelItem {
  type?: string
  channel: string
}

/**
 * IpcMain
 */
export type CurIpcMain = Record<string, any> & IpcMain

/**
 * aboutAction Return
 */
export interface AboutActionReturn {
  name: string
  version: string
}

/**
 * 返回函数
 */
export type FnReturn<T = any> = (...arg: T[]) => T

/**
 * 参数
 */
export interface OpenWindowActionParam {
  path?: string
}

/**
 * CreateServeAction 参数
 */
export interface CreateServeParam {
  window: BrowserWindow
  path?: string
}

/**
 * ActionEvent
 */
export interface ActionEvent<T = never, R = void> {
  (e: IpcMainInvokeEvent, option: T): R
}
