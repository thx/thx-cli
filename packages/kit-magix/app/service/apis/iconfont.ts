/**
 * mm iconfont
 * --check 比对项目与iconfont平台的icon，列出项目中没有用到的icon
 */
import util from '../../util/util'
import * as fse from 'fs-extra'
import * as chalk from 'chalk'
import * as path from 'path'
import * as walk from 'walk'
import { EventEmitter } from 'events'
import { iconfont, utils } from '@ali/mm-cli-core'

//
async function checkExec (cwd) {
  const isRoot = await utils.isInAppRoot(cwd)
  const magixCliConfig = await util.getMagixCliConfig(cwd)
  const iconfontId = magixCliConfig.iconfontId

  if (!isRoot) {
    throw new Error('请在项目根目录下执行本命令')
  }

  if (!iconfontId) {
    throw new Error('请先在 magixCliConfig 中配置好 iconfontId ')
  }
}

export default {
  /**
     * params.cwd [string] 项目根目录
     */
  // 同步iconfont配置到项目中
  exec (params: any = {}) {
    const emitter = new EventEmitter()
    const cwd = params.cwd

    setTimeout(async () => {
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      const iconfontId = magixCliConfig.iconfontId

      try {
        await checkExec(cwd)
      } catch (error) {
        return emitter.emit('close', {
          error
        })
      }

      /**
            * mm iconfont 同步字体文件配置到项目中
            */

      if (!magixCliConfig || !magixCliConfig.iconfontPath) {
        return emitter.emit('close', {
          error: '请先在 magixCliConfig 中配置好 iconfontPath'
        })
      }

      let iconfontPathAbs = magixCliConfig.iconfontPath
      if (cwd) {
        iconfontPathAbs = path.resolve(cwd, iconfontPathAbs)
      }

      let iconfontFile = fse.readFileSync(iconfontPathAbs, 'utf-8')
      let projectDetail
      try {
        // ✘ ⓘ ✔ ✦ ♨
        emitter.emit('data', chalk.green('♨ iconfont 数据加载中，请稍候...'))
        projectDetail = await iconfont.getProject(iconfontId)
        // emitter.emit('data', chalk.green(`✔ iconfont数据加载成功`))
      } catch (error) {
        return emitter.emit('close', {
          error
        })
      }

      if (!projectDetail || !projectDetail.font) {
        return emitter.emit('close', {
          error: '没有找到 icon，请先上 iconfont 平台添加 icon 并生成'
        })
      }

      // 正则匹配替换
      // 只匹配css文件的第一个 font-face，请确保 iconfont font-face 在第一个位置
      iconfontFile = iconfontFile.replace(/@font-face\s*\{(?:.|\n)+?font-family\s*:\s*["'](.+)["'](?:.|\n)+?\}/,
`@font-face {
  font-family: '$1';
  ${projectDetail.font.css_font_face_src}
}`)
      await fse.outputFile(iconfontPathAbs, iconfontFile)

      emitter.emit('data', chalk.green('✔ iconfont 字体文件配置同步成功'))
      emitter.emit('data', chalk.grey(`  └─ 文件路径：${magixCliConfig.iconfontPath}`))
      emitter.emit('close', {})
    }, 0)

    return emitter
  },

  /**
     * params.cwd [string] 项目根目录
     */
  // 检测项目中无效的iconfont
  check (params: any = {}) {
    const emitter = new EventEmitter()
    const cwd = params.cwd

    setTimeout(async () => {
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      const scanPath = magixCliConfig.iconfontScanPath || 'src' // 默认扫描src目录下
      const absolutePath = path.resolve(process.cwd(), scanPath)
      const iconfontId = magixCliConfig.iconfontId

      try {
        await checkExec(cwd)
      } catch (error) {
        return emitter.emit('close', {
          error
        })
      }

      // 获取iconfont平台该项目的所有icons
      let projectDetail
      try {
        emitter.emit('data', chalk.green('♨ iconfont 数据加载中，请稍候...'))
        projectDetail = await iconfont.getProject(iconfontId)
        emitter.emit('data', chalk.green('✔ iconfont 数据加载成功'))
      } catch (error) {
        return emitter.emit('close', {
          error
        })
      }

      //
      const htmlCodes = [] // html里使用的
      const htmlCodeMaps = {}
      const cssCodes = [] // css里使用的content
      projectDetail.icons.forEach((icon, i) => {
        const parseCode = parseInt(icon.unicode).toString(16)
        htmlCodeMaps[`&#x${parseCode};`] = icon
        htmlCodes.push(`&#x${parseCode};`)
        cssCodes.push(`\n${parseCode}`)
      })

      emitter.emit('data', chalk.cyan(`ⓘ 共有${htmlCodes.length}个图标`))
      emitter.emit('data', chalk.green('♨ 开始解析数据，请稍候...'))

      // 遍历所有文件判断是否使用过icon
      // let unmatchIcons = [] //项目中用到但是iconfont平台上没有的icon
      // let unmatchIconsMap = {}
      const walker = walk.walk(absolutePath)
      walker.on('file', async (root, fileStats, next) => {
        const fileContent = await fse.readFile(path.resolve(root, fileStats.name), 'utf-8')

        // 找到有用的icon，剔除掉，剩下的就是失效的icon
        htmlCodes.forEach((icon, i) => {
          if (fileContent.includes(icon)) {
            htmlCodes.splice(i, 1)
          }
        })

        // 找出项目中使用的icon但是在iconfont平台上没有的icon
        // 不使用此方案了，理由是可能项目中引用了组件平台通用的mc-iconfont，这样会导致误扫描出很多假的失效图标
        // let matchs = fileContent.match(/&#x[^;&#x]+;/g)
        // if (matchs && matchs.length) {
        //     for (const icon of matchs) {
        //         if (!projectDetail.htmlCodes.includes(icon)) {
        //             if (!unmatchIconsMap[icon]) {
        //                 unmatchIcons.push({
        //                     icon,
        //                     file: path.resolve(root, fileStats.name)
        //                 })
        //                 unmatchIconsMap[icon] = true
        //             }
        //         }
        //     }
        // }

        next()
      })

      walker.on('errors', (root, nodeStatsArray, next) => {
        next()
      })

      walker.on('end', () => {
        emitter.emit('data', chalk.green('✔ 解析完毕'))

        if (htmlCodes.length) { // 有无效icon
          emitter.emit('data', chalk.yellow(`ⓘ 以下是没有被本项目代码引用到的 icon，请酌情删除(共${htmlCodes.length}个)`))
          for (const icon of htmlCodes) {
            emitter.emit('data', `${chalk.white(`  ├── ${icon}`)}${chalk.grey(` - ${htmlCodeMaps[icon].name}`)}`)
          }
        } else {
          // 没有无效的
          emitter.emit('data', chalk.green('✔ 恭喜，没有找到无效的 icon，请继续保持'))
        }

        return emitter.emit('close', {})
      })
    }, 0)

    return emitter
  }
}
