import { utils } from 'thx-cli-core'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as Path from 'path'
import * as requestP from 'request-promise'

/**
 * 递归往上寻找项目中某文件
 * @param  {[String]} fileName 需要查找的目标文件名称
 * @return {[Array]}  返回找到目标文件的目录路径，放在一个数组里
 * @deprecated
 */
export function getExistFile(fileName: string, cwd?: string): Promise<any> {
  return new Promise(resolve => {
    const _cwd = cwd || process.cwd()
    const cwds = _cwd.split('/')

    function isExistFile(paths) {
      if (paths.length === 0) {
        resolve(false)
        // reject(new Error('文件不存在'))
        return
      }
      const _file = `${paths.join('/')}/${fileName}`
      fs.stat(_file, err => {
        if (!err) {
          resolve(paths)
        } else {
          paths.pop()
          isExistFile(paths)
        }
      })
    }

    isExistFile(cwds)
  })
}

// 获取项目的RAP的id
export async function getRapProjectId(cwd: string = process.cwd()) {
  const appPath = await utils.getAppPath(cwd)
  const pkg = await utils.getAppPkg(appPath)
  const magixCliConfig = pkg.magixCliConfig || {}
  const rmxConfig = pkg.rmxConfig || {}

  return (
    rmxConfig.rapProjectId ||
    magixCliConfig.rapProjectId ||
    magixCliConfig.matProjectId
  )
}

// 从项目本地package.json里获取magixCliConfig配置
export async function getMagixCliConfig(cwd?) {
  const appPath = await utils.getAppPath(cwd)
  const pkg = await utils.getAppPkg(appPath)
  const magixCliConfig = pkg.magixCliConfig || {}

  return magixCliConfig
}

// 如果本地有模板则用本地的模板
export async function getTmplGenerater(
  originPath,
  configKey,
  cwd
): Promise<any> {
  const magixCliConfig = await getMagixCliConfig(cwd)
  let managerTmplGeneraterOrigin = require(originPath)
  if (managerTmplGeneraterOrigin.__esModule) {
    managerTmplGeneraterOrigin = managerTmplGeneraterOrigin.default
  }

  // 优先使用package.json里的magixCliConfig的modelsTmplPath配置
  if (magixCliConfig[configKey]) {
    const isExistModelsTmpl = await getExistFile(magixCliConfig[configKey], cwd)
    if (isExistModelsTmpl) {
      const managerFile = fs.readFileSync(
        Path.resolve(isExistModelsTmpl.join('/'), magixCliConfig[configKey]),
        'utf-8'
      )
      // eslint-disable-next-line no-eval
      managerTmplGeneraterOrigin = eval(`(${managerFile})`) // 转成执行代码
      console.log('ⓘ 检测到存在本地模板，将使用本地模板生成文件')
    }
  }

  return managerTmplGeneraterOrigin
}

// 拉取各平台接口生成本地配置文件
export async function generateLocalConfig(options) {
  const magixCliConfig = options.magixCliConfig
  let resp
  try {
    resp =
      options.resp ||
      (await requestP({
        url: options.api,
        rejectUnauthorized: false,
        timeout: 10000 // 10秒请求超时
      }))
  } catch (error) {
    throw new Error('接口请求失败')
  }

  // 生成models.js的路径默认值
  // 优先获取package.json里配置
  const originConfigPath =
    magixCliConfig[options.configPathKey] || options.defaultConfigPath

  if (!originConfigPath) {
    throw new Error('缺失生成文件路径配置')
  }

  const tmplGenerater = await getTmplGenerater(
    options.defaultConfigTmplPath,
    options.configTmplKey,
    options.cwd
  )
  const path = await utils.getAppPath(options.cwd)
  const configJsPath = Path.resolve(path, originConfigPath)

  // 生成models.js文件
  const configJs = await tmplGenerater(resp)
  fse.outputFile(configJsPath, configJs)
}

// 兼容老的galleries配置为{}key-value形式，转在[{}]对象数组形式，并兼容更早之前只配置galleryPath时的情形
export function compatGalleriesConfig(magixCliConfig: any = {}) {
  let galleriesConfig = magixCliConfig.galleries || []
  let magixGalleryExist = false

  // 兼容老的galleries配置
  if (Object.prototype.toString.call(galleriesConfig) === '[object Object]') {
    const _galleriesConfig = []
    for (const k in galleriesConfig) {
      _galleriesConfig.push({
        name: k,
        repoName: utils.getPkgInfo(k).name,
        path: galleriesConfig[k]
      })
    }
    galleriesConfig = _galleriesConfig
  }

  for (const gallery of galleriesConfig) {
    const gName = utils.getPkgInfo(gallery.name).name // 组件库名
    gallery.repoName = gName
    if (gName === 'magix-gallery') {
      magixGalleryExist = true
    }
  }

  if (magixCliConfig.galleryPath && !magixGalleryExist) {
    // magix-gallery默认安装最新版
    galleriesConfig = [
      {
        name: 'magix-gallery',
        path: magixCliConfig.galleryPath
      }
    ]
  }

  return galleriesConfig
}
