import { createStream } from 'bunyan-logentries'
import * as Logger from 'bunyan'
import type { FnReturn } from '~/types'

export const appLog = (): Record<string, FnReturn> => {
  const token = 'xxxxxxxxxxxxxxxxx'
  const log = Logger.createLogger({
    name: '',
    streams: [
      {
        name: 'blueprint',
        stream: createStream({ token }),
        type: 'raw'
      }
    ]
  })

  const info = (T: any) => {
    log.info(T)
  }

  return {
    info
  }
}

// export const log = (): Logger => {
//   const myLog = Logger.createLogger({ name: 'blueprint' })
//   // logger.transports.file.maxSize = 1002430 // 10M
//   // logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
//   // const date = new Date()
//   // const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
//   // const templateFilePath = join(process.cwd(), '/resources/extra')
//   // logger.transports.file.fileName = `${templateFilePath}\\electron_log\\app\\${str}.log`

//   // const info = (param: string) => {
//   //   logger.info(param)
//   // }

//   return myLog
// }
