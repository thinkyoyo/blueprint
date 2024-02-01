// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', { ipcRenderer })
