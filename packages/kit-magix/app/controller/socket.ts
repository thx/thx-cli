import { redBright } from 'chalk'
import logger from '../logger'
import modelsApi from '../service/apis/models'
import devApi from '../service/apis/dev'
import dailyApi from '../service/apis/daily'
import publishApi from '../service/apis/publish'
import spmlogApi from '../service/apis/spmlog'
import iconfontApi from '../service/apis/iconfont'
import chartparkApi from '../service/apis/chartpark'
import galleryApi from '../service/apis/gallery'

const devMap: any = {}

// this.socket要放到上下文
function execModels (socket, message) {
  const { cwd, models, repeatApis, originModels } = message
  console.log('modelsApi start', message)
  modelsApi.exec({ cwd, models, repeatApis, originModels }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'models/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'models/success'
      })
    }
  })
}

function execDev (socket, message) {
  const { cwd, port, ip, isCloseHmr, isCloseDocs, isCloseDesiger, isHttps, isDebug, status } = message
  if (status == 1) {
    if (devMap.cwd) {
      try {
        devMap.cwd.stopDev()
        devMap.cwd = null
      } catch (e) {

      }
    }
    console.log('dev cwd', cwd)
    devMap.cwd = devApi.exec({ cwd, port, ip, isCloseHmr, isCloseDocs, isCloseDesiger, isHttps, isDebug }).on('data', (msg) => {
      socket.broadcast({ message: msg.toString('utf8') })
    })
    devMap.cwd.on('close', (resp) => {
      if (resp.error) {
        socket.exit({
          message: resp.error,
          type: 'dev/error'
        })
      } else {
        socket.exit({
          message: '结束',
          type: 'dev/success'
        })
      }
    })
  } else {
    if (devMap.cwd) {
      devMap.cwd.stopDev()
    }
    socket.exit({
      message: 'exit',
      type: 'devstop/success'
    })
  }
}

function execDaily (socket, params) {
  const { cwd, branch, message, nospm, uncheck } = params
  dailyApi.exec({ cwd, branch, message, nospm, uncheck }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (typeof resp === 'object') {
      logger.debug(__filename)
      logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
    }

    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'daily/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'daily/success'
      })
    }
  })
}

function execPublish (socket, params) {
  const { cwd, branch, message, nospm, international, uncheck } = params
  publishApi.exec({ cwd, branch, message, nospm, international, uncheck }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (typeof resp === 'object') {
      logger.debug(__filename)
      logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
    }

    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'publish/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'publish/success'
      })
    }
  })
}

function execSpmlog (socket, message) {
  const { cwd, removeSpm } = message
  spmlogApi.exec({ cwd, removeSpm }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (typeof resp === 'object') {
      logger.debug(__filename)
      logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
    }

    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'spmlog/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'spmlog/success'
      })
    }
  })
}

function execChartpark (socket, message) {
  const { cwd } = message
  chartparkApi.exec({ cwd }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (resp.error) {
      socket.exit({
        message: resp.error || 'error',
        type: 'chartpark/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'chartpark/success'
      })
    }
  })
}

function execIconfont (socket, message) {
  const { cwd } = message
  iconfontApi.exec({ cwd }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (typeof resp === 'object') {
      logger.debug(__filename)
      logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
    }

    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'iconfont/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'iconfont/success'
      })
    }
  })
}

function execGallery (socket, message) {
  const { cwd, name } = message
  galleryApi.exec({ cwd, name }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (typeof resp === 'object') {
      logger.debug(__filename)
      logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
    }

    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'gallery/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'gallery/success'
      })
    }
  })
}

function checkGallery (socket, message) {
  const { cwd, name } = message
  galleryApi.check({ cwd, name }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') })
  }).on('close', (resp) => {
    if (typeof resp === 'object') {
      logger.debug(__filename)
      logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
    }

    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'gallery/check/error'
      })
    } else {
      socket.exit({
        message: resp.data,
        type: 'gallery/check/success'
      })
    }
  })
}

function checkIconfont (socket, message) {
  const { cwd } = message
  iconfontApi.check({ cwd }).on('data', (msg) => {
    socket.broadcast({ message: msg.toString('utf8') + '\r\n' })
  }).on('close', (resp) => {
    if (typeof resp === 'object') {
      logger.debug(__filename)
      logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
    }

    if (resp.error) {
      socket.exit({
        message: resp.error,
        type: 'iconfont/check/error'
      })
    } else {
      socket.exit({
        message: '结束',
        type: 'iconfont/check/success'
      })
    }
  })
}

const actions = {
  execModels,
  execDev,
  execDaily,
  execPublish,
  execIconfont,
  execChartpark,
  execGallery,
  checkGallery,
  execSpmlog,
  checkIconfont
}

export default actions
