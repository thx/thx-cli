import { utils } from 'thx-cli-core'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as Path from 'path'
import * as requestP from 'request-promise'
import { spawn, SpawnOptions } from 'child_process'

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

    for (const galleryName in galleriesConfig) {
      const { name: repoName, version } = utils.getPkgInfo(galleryName)

      _galleriesConfig.push({
        name: galleryName,
        repoName,
        version,
        path: galleriesConfig[galleryName]
      })
    }
    galleriesConfig = _galleriesConfig
  }

  for (const gallery of galleriesConfig) {
    const { name, version } = utils.getPkgInfo(gallery.name) // 组件库名,版本
    gallery.repoName = name
    gallery.version = version

    if (name === 'magix-gallery') {
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

// 降权执行
function spawnDowngradeSudo(command, args, options = {}) {
  const _options: SpawnOptions = {
    // MO TODO 不设置 any 会属性兼容报错
    shell: process.platform === 'win32' // win 下需要设置 shell 为 true
  }
  Object.assign(_options, options)

  // 降权
  if (process.env.SUDO_GID) {
    _options.gid = parseInt(process.env.SUDO_GID, 10)
  }
  if (process.env.SUDO_UID) {
    _options.uid = parseInt(process.env.SUDO_UID, 10)
  }

  return new Promise((resolve, reject) => {
    const sp = spawn(command, args, _options)

    sp.stderr.on('data', data => {
      if (data.includes('No such file or directory')) {
        const error = new Error()
        // @ts-ignore
        error.code = 'ENOENT'
        reject(error)
      }
    })

    sp.on('close', code => {
      resolve(code)
    })
  })
}

// 同步 node_modules 下组件的 package.json 到项目组件目录下，改名为 pkg.json
export async function syncGalleryPkg(galleries = []) {
  // 用子进程降权的形式执行，以防止文件权限污染
  const promises = []
  for (const gallery of galleries) {
    if (gallery.name && gallery.path) {
      promises.push(
        spawnDowngradeSudo('cp', [
          '-R',
          `node_modules/${gallery.name}/package.json`,
          `${gallery.path}/pkg.json`
        ])
      )
    }
  }

  await Promise.all(promises)
}
