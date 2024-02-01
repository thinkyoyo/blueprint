import type { HandleChannelItem } from '../types'

/**
 * icp 程序
 */
export const handleChannels: HandleChannelItem[] = [
  {
    channel: 'open'
  },
  {
    channel: 'minimize'
  },
  {
    channel: 'maximize'
  },
  {
    channel: 'quit'
  },
  {
    type: 'on',
    channel: 'start'
  },
  {
    type: 'on',
    channel: 'move'
  },
  {
    channel: 'about'
  },
  {
    channel: 'unzip'
  },
  {
    channel: 'selectFile'
  },
  {
    channel: 'openWindow'
  },
  {
    channel: 'copy'
  },
  {
    channel: 'getFilePath'
  }
]
