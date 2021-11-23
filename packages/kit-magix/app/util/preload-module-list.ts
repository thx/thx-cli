
import util from './util'
import * as path from 'path'
import * as walk from 'walk'
import * as fse from 'fs-extra'
import { utils } from '@ali/mm-cli-core'

// 生成项目的模块清单列表
export async function genModuleList () {
  return new Promise(async (resolve, reject) => {
    try {
      const { rootAppName } = await util.getMagixCliConfig()
      const appPath = await utils.getAppPath()

      const jsExtNames = ['.js', '.ts', '.es']
      const walker = walk.walk(`${appPath}/src/${rootAppName}`)
      let count = 0
      const moduleList = []

      walker.on('file', async (root, fileStats, next) => {
        const fileName = fileStats.name
        const extName = path.extname(fileName)

        // 只查找js文件并且文件名非_打头的，gallery下的_打头的js文件非模块
        if (jsExtNames.includes(extName) && /^[^_].+$/.test(fileName)) {
          count++
          const name = fileName.replace(extName, '')
          const prefix = new RegExp(`^.+${rootAppName}`)
          const moduleName = `${root.replace(appPath, '').replace(prefix, rootAppName)}/${name}`
          moduleList.push(`'${moduleName}'`)
        }

        next()
      })

      walker.on('errors', function (root, nodeStatsArray, next) {
        next()
      })

      walker.on('end', async function () {
      // console.log('walk end...', count)
        const file = `${appPath}/src/${rootAppName}/preloadModuleList.ts`
        const fileContent = `export default [
  ${moduleList.join(',')}
]
`
        await fse.outputFile(file, fileContent)
        resolve(count)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// 生成模块预加载逻辑的js文件
export async function genPreloadModule () {
  const { rootAppName } = await util.getMagixCliConfig()
  const appPath = await utils.getAppPath()

  const preloadModuleTs = `export default {
  // 预加载静态资源
  start (customOptions = {}) {
    const options = {
      BATCH_COUNT: 5, // 一次批量加载 BATCH_COUNT 个模块
      TIME_INTERVAL: 3000, // 每次批量加载模块的间隔时间，单位(ms)
      PRELOAD_DELAY: 5000// 开启预加载静态资源的延迟时间，单位(ms)
    }
    Object.assign(options, customOptions)

    seajs.use(['${rootAppName}/preloadModuleList'], (ModuleList) => {
      if (!ModuleList) {
        return
      }

      setTimeout(e => {
        let i = 0

        // 间隔预加载资源主函数
        function recur () {
          const currModules = ModuleList.default.slice(i * options.BATCH_COUNT, (i + 1) * options.BATCH_COUNT)
          i++
          if (currModules.length) {
            console.log('%c预加载模块: ', 'color: blue')
            console.log(currModules.join('\\n'))
            seajs.use(currModules)
            setTimeout(() => {
              recur()
            }, options.TIME_INTERVAL)
          } else {
            console.log('%c所有模块预加载完毕！', 'color: green')
          }
        }

        recur()
      }, options.PRELOAD_DELAY)
    })
  }
}
`
  const filePath = `${appPath}/src/${rootAppName}/preloadModule.ts`
  await fse.outputFile(filePath, preloadModuleTs)
}
