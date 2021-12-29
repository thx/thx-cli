/**
 * 将node_modules下的magix-gallery同步到本地项目中gallery下
 *  - mm gallery: 默认同步所有组件到本地项目中，如果有本地组件被修改过，给出提示，来决定是否覆盖升级
 *  - mm gallery -n <galleryName>: 指定同步某个组件，如果本地有组件有修改过，给出提示
 *  - mm gallery -l: 列出本地所有组件以及组件版本号
 *  - mm gallery --gallery-repos <repoName>: 指定同步组件库，多个组件库以逗号分隔
 */

/**
 * galleries配置规则：[{
 *   //可指定版本号
 *   name: magix-gallery@1.3.10,
 *
 *   // 指定组件库自身要拷贝的文件夹目录，同一个组件库可以多次同步不同目录下的文件 (不配置则默认为 tmpl)
 *   // 拷贝文件时会忽略掉 __ 打头的文件夹
 *   originPath: src/magix5-gallery/gallery
 *
 *   // 组件同步到项目中的位置
 *   path: src/app/gallery,
 *
 *   // @deprecated 组件中忽略掉修改判断的文件，比如项目中的_vars_override.less
 *   ignoreFiles: ["mx-style/_vars_override.less"]
 *
 *   // 标识组件库是单组件模式
 *   single: true
 * }]
 *
 * 组件仓库 mm publish --npm 默认发布到 npm 源，可以配置 magixCliConfig.publisyType = "tnpm" 来指定发布到 tnpm 源
 *
 * 兼容老配置：
 *  - galleryPath默认以magix-gallery配置进galleries里
 *  - galleries配置优先于galleryPath
 */
import { utils } from 'thx-cli-core'
import {
  cyan,
  green,
  greenBright,
  cyanBright,
  grey,
  white,
  yellow,
  yellowBright
} from 'chalk'
import * as util from '../util/index'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as md5 from 'md5'
import { EventEmitter } from 'events'

const GALLERY_DIR_DEFAULT = 'tmpl' // 默认组件仓库下组件存放的目录名
// 匹配magix-gallery仓库tmpl文件夹下非组件的文件夹正则
const notGalleryFolderRexp = /^__/

/**
 * 获取 js 文件里的组件版本信息，版本配置规则：
 * 在 js 文件的头部配置 /* ver: 1.0.0 */
/* */
function getVersion(filePath): string | undefined {
  const fileContent = fs.readFileSync(filePath, {
    encoding: 'utf8'
  })
  const version = /\/\*\s*ver\s*:\s*([^\s]+)\s*\*\//.exec(fileContent)
  if (version) return version[1]
}

/**
 * 判断该组件是否本地修改过
 */
function isModified(
  galleryName,
  galleryPath,
  galleryIgnoreFiles = [],
  galleryPathOrigin,
  root?
) {
  try {
    const destGalleryPath = path.resolve(root, galleryPath, galleryName)
    const originGalleryPath = path.resolve(root, galleryPathOrigin, galleryName)
    const galleryFiles = fs.readdirSync(destGalleryPath)
    const originGalleryFiles = fs.readdirSync(originGalleryPath)
    const modifyFiles = [] // 有修改过的文件集合
    const _galleryPath = path.join(galleryPath, galleryName)

    galleryFiles.forEach(file => {
      // 忽略 版本Json
      if (file === 'pkg.json') {
        return
      }

      // 组件文件的路径
      const filePath = path.join(_galleryPath, file)

      // 如果galleries配置的ignoreFiles与该文件相等，则跳过该文件的已修改提示
      for (const ignore of galleryIgnoreFiles) {
        const _galleryName = ignore.split('/')[0]
        const _fileName = ignore.split('/')[1]

        if (_galleryName === galleryName && file === _fileName) {
          return
        }
      }

      // originGalleryFiles为node_modules下组件里的文件，
      // 如果组件里不存在，本地存在，则打上标记为deleted状态
      // 否则为modified状态
      let isExist = false
      for (const item of originGalleryFiles) {
        if (!notGalleryFolderRexp.test(item)) {
          if (item === file) {
            isExist = true
            break
          }
        }
      }

      if (isExist) {
        // 根据md5值校验本地文件有无修改，有改过则给出提示
        try {
          const fileContent = fs.readFileSync(
            path.resolve(destGalleryPath, file),
            'utf8'
          )
          let rexp
          if (path.extname(file) === '.html') {
            // html注释不一样
            rexp = /<!--md5:(.+)-->\n/
          } else {
            rexp = /\/\*md5:(.+)\*\/\n/
          }

          let originMd5 = rexp.exec(fileContent) // 原来的md5
          originMd5 = originMd5 && originMd5[1]
          const newMd5 = md5(fileContent.replace(rexp, '')) // 新md5，可能有被修改

          if (originMd5 !== newMd5) {
            modifyFiles.push({
              type: 'modified',
              file,
              filePath
            })
          }
        } catch (error) {
          if (error.code === 'EISDIR') {
            //
          }
        }
      } else {
        modifyFiles.push({
          type: 'deleted',
          file,
          filePath
        })
      }
    })

    return {
      galleryName: galleryName,
      modifyFiles: modifyFiles,
      galleryPath: galleryPath
    }
  } catch (error) {
    return {
      galleryName: galleryName,
      modifyFiles: [],
      galleryPath: galleryPath
    }
  }
}

// 先安装magixCliConfig.galleries里的所有组件包
function installGallery(pkgManager, gallery, emitter, cwd): Promise<any> {
  return new Promise((resolve, reject) => {
    const pkgManagerCmd =
      process.platform === 'win32' ? `${pkgManager}.cmd` : pkgManager

    // --no-save: mm gallery 只纯粹安装包，不配置在package.json的依赖里，避免 snowpack 同步不必要的包问题
    utils
      .spawn(pkgManagerCmd, ['install', gallery.name, '--no-save', '--color'], {
        cwd
      })
      .on('data', msg => {
        emitter.emit('data', msg)
      })
      .on('close', resp => {
        resolve(null)
      })
  })
}

/**
 * 同步单个组件文件夹内所有文件，不含__打头的文件夹
 */
function syncGallery(
  galleryName,
  galleryPath,
  galleryPathOrigin,
  repositoryName,
  root,
  emitter
) {
  const destGalleryPath = path.resolve(root, galleryPath, galleryName)
  try {
    const galleryFiles = fs.readdirSync(
      path.resolve(galleryPathOrigin, galleryName)
    )
    const subGallerys = []

    // 先删除本地的组件
    fs.removeSync(destGalleryPath)

    // 组件子文件
    let fileCount = 0
    galleryFiles.forEach((gFile, i) => {
      // 忽略__打头的文件夹
      if (!notGalleryFolderRexp.test(gFile)) {
        const originGalleryPath = path.resolve(
          galleryPathOrigin,
          galleryName,
          gFile
        )
        const _destGalleryPath = path.resolve(destGalleryPath, gFile)

        if (path.extname(originGalleryPath) === '.js') {
          const version = getVersion(originGalleryPath)
          subGallerys.push({
            name: path.parse(gFile).name,
            version: version
          })
        }

        try {
          //
          fs.copySync(originGalleryPath, _destGalleryPath)

          // 对文件md5，放在文件头部注释里
          try {
            let fileContent = fs.readFileSync(_destGalleryPath, {
              encoding: 'utf8'
            })
            const fileMd5 = md5(fileContent)
            if (path.extname(_destGalleryPath) === '.html') {
              // html注释方式不一样
              fileContent = `<!--md5:${fileMd5}-->\n${fileContent}`
            } else {
              fileContent = `/*md5:${fileMd5}*/\n${fileContent}`
            }
            fs.writeFileSync(_destGalleryPath, fileContent)
            fileCount++
          } catch (error) {
            if (error.code === 'EISDIR') {
              // 忽略文件夹
            }
          }
        } catch (error) {
          emitter.emit('data', error)
        }
      }
    })

    if (fileCount > 0) {
      // 打印出所有子组件的版本信息
      const gallerysVersion = subGallerys
        .map(g => {
          const version = g.version ? 'v' + g.version : '未声明版本'
          return g.name + ': ' + version
        })
        .join(', ')

      // 单个同步组件时列出组件库名、组件库路径
      if (repositoryName) {
        emitter.emit(
          'data',
          `${green(`同步组件库[${repositoryName}]`)} ${grey(`${galleryPath}`)}`
        )
      }

      if (galleryName) {
        emitter.emit(
          'data',
          `${green('✔')} ${cyanBright(galleryName)} ${grey(gallerysVersion)}`
        )
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      emitter.emit('data', yellow('✘ 该组件不存在，请检查组件名称'))
    }
  }
}

export default {
  /**
   * params.cwd [string] 项目根目录
   * params.name [string] 指定同步某个组件，如果不填则是全量同步
   * params.modifiedGallerys [array] 本地有修改的组件
   * params.isIgnoreModify [boolean] 是否跳过本地有修改的组件，只升级无修改的组件
   * params.galleryRepos [array] 需要更新的组件库，不填则更新所有组件库
   */
  exec(params: any = {}) {
    const emitter = new EventEmitter()
    const { cwd, modifiedGallerys, isIgnoreModify, name, galleryRepos } = params

    setTimeout(async () => {
      if (!(await utils.isInAppRoot(cwd))) {
        return emitter.emit('close', {
          error: '请在项目根目录下执行本命令'
        })
      }

      const root = await utils.getAppPath(cwd)
      // 组件路径可配置在package.json的magixCliConfig里
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      const galleriesConfig = util.compatGalleriesConfig(magixCliConfig)

      try {
        /**
         * mm gallery -n mx-copy
         * 指定-n的话，只同步单个组件
         */
        if (typeof name === 'string' && name !== '') {
          let exist = false
          let _galleryPath
          let _galleryPathOrigin
          let _repositoryName
          // let _galleryIgnoreFiles

          for (const gallery of galleriesConfig) {
            const repositoryName = gallery.repoName
            // node_modules下的原始gallery路径
            _galleryPathOrigin = path.resolve(
              root,
              'node_modules',
              repositoryName,
              gallery.originPath || GALLERY_DIR_DEFAULT
            )

            try {
              // 测试看存在不存在该组件
              fs.readdirSync(path.resolve(_galleryPathOrigin, name))
              exist = true //
              _galleryPath = gallery.path
              // _galleryIgnoreFiles = gallery.ignoreFiles
              _repositoryName = repositoryName
              break
            } catch (error) {}
          }

          // 找到该组件
          if (exist) {
            // 如果标明忽略本地修改过的组件，并且当前组件是修改过的，则跳过
            if (
              !isIgnoreModify ||
              (isIgnoreModify &&
                !modifiedGallerys.find(gallery => gallery.galleryName === name))
            ) {
              syncGallery(
                name,
                _galleryPath,
                _galleryPathOrigin,
                _repositoryName,
                root,
                emitter
              )
            }

            return emitter.emit('close', {})
          } else {
            // 不存在的组件，给出提示
            return emitter.emit('close', {
              error: '该组件不存在，请检查组件名称'
            })
          }
        } else {
          /**
           * mm gallery
           * 批量同步组件, 从node_modules里同步到gallery下
           */
          let galleryTotal = 0

          // 需要覆盖的组件集合
          const galleryFolders = []

          for (const gallery of galleriesConfig) {
            const repositoryName = gallery.repoName
            if (!galleryRepos || galleryRepos.includes(repositoryName)) {
              // src/app/gallery
              const _galleryPath = gallery.path
              // node_modules下的原始gallery路径
              const _galleryPathOrigin = path.resolve(
                root,
                'node_modules',
                repositoryName,
                gallery.originPath || GALLERY_DIR_DEFAULT
              )
              const _gallerys = fs.readdirSync(_galleryPathOrigin)

              // 单组件仓库
              if (gallery.single) {
                galleryFolders.push({
                  single: gallery.single,
                  repositoryName,
                  _galleryPath,
                  _galleryPathOrigin
                })
              }

              // 多组件仓库
              else {
                try {
                  const __gallerys = []

                  // 默认全量覆盖
                  _gallerys.forEach(galleryName => {
                    if (!notGalleryFolderRexp.test(galleryName)) {
                      __gallerys.push({
                        galleryName,
                        _galleryPath,
                        _galleryPathOrigin
                      })
                    }
                  })

                  galleryFolders.push({
                    _gallerys: __gallerys,
                    repositoryName,
                    _galleryPath,
                    _galleryPathOrigin
                  })
                } catch (error) {
                  return emitter.emit('close', {
                    error: `组件库 [${repositoryName}] 同步失败，失败原因如下: ${error}`
                  })
                }
              }
            }
          }

          // 逐个同步组件
          galleryFolders.forEach(g => {
            emitter.emit(
              'data',
              `${white(
                `\n同步组件库 [${greenBright(g.repositoryName)}]`
              )} ${grey(`${g._galleryPath}`)}`
            )

            if (g.single) {
              // 单组件仓库
              if (!isIgnoreModify) {
                syncGallery(
                  '',
                  g._galleryPath,
                  g._galleryPathOrigin,
                  null,
                  root,
                  emitter
                )
                galleryTotal++
              }
            } else {
              //多组件仓库
              g._gallerys.forEach(gg => {
                // 如果标明忽略本地修改过的组件，并且当前组件是修改过的，则跳过
                if (
                  !isIgnoreModify ||
                  (isIgnoreModify &&
                    !modifiedGallerys.find(
                      gallery => gallery.galleryName === gg.galleryName
                    ))
                ) {
                  syncGallery(
                    gg.galleryName,
                    gg._galleryPath,
                    gg._galleryPathOrigin,
                    null,
                    root,
                    emitter
                  )
                  galleryTotal++
                }
              })
            }

            // 将 node_modules 下组件的 package.json 复制进项目的组件目录下，用来判断本地组件版本是否有更新
            try {
              fs.copySync(
                path.resolve('node_modules', g.repositoryName, 'package.json'),
                path.resolve(g._galleryPath, 'pkg.json')
                // `node_modules/${g.repositoryName}/package.json`,
                // `${g._galleryPath}/pkg.json`
              )

              emitter.emit(
                'data',
                `${grey('✔ 已同步组件库 package.json 信息到项目组件目录下')}`
              )
            } catch (error) {
              emitter.emit('data', error)
            }
          })

          emitter.emit('data', grey('-------------------'))
          emitter.emit(
            'data',
            `${green('✔')} ${white(
              `共同步了 ${cyanBright(galleryTotal)} 个组件`
            )}`
          )
          return emitter.emit('close', {})
        }
      } catch (error) {
        return emitter.emit('close', {
          error
        })
      }
    }, 0)

    return emitter
  },

  /**
   * params.cwd [string] 项目根目录
   * params.name [string] 检测组件是否在本地被修改过，不填name则检测全量组件
   * params.galleryRepos [array] 需要更新的组件库，不填则更新所有组件库
   * params.pkgManager [string] 包管理器 npm|tnpm
   */
  check(params: any = {}) {
    const emitter = new EventEmitter()
    const { cwd, name, galleryRepos, pkgManager = 'npm' } = params

    setTimeout(async () => {
      if (!(await utils.isInAppRoot(cwd))) {
        return emitter.emit('close', {
          error: '请在项目根目录下执行本命令'
        })
      }

      const root = await utils.getAppPath(cwd)
      // 组件路径可配置在package.json的magixCliConfig里
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      const galleriesConfig = util.compatGalleriesConfig(magixCliConfig)

      for (const gallery of galleriesConfig) {
        if (!galleryRepos || galleryRepos.includes(gallery.repoName)) {
          emitter.emit(
            'data',
            white(`\n↳ 安装组件库 [${greenBright(gallery.name)}]`)
          )
          await installGallery(pkgManager, gallery, emitter, cwd)
        }
      }

      let modifiedGalleryArr = []

      if (name) {
        /**
         * 单个
         */

        let exist = false
        let _galleryPath
        let _galleryPathOrigin
        let _galleryIgnoreFiles

        for (const gallery of galleriesConfig) {
          if (!galleryRepos || galleryRepos.includes(gallery.repoName)) {
            // node_modules下的原始gallery路径
            _galleryPathOrigin = path.resolve(
              root,
              'node_modules',
              gallery.repoName,
              gallery.originPath || GALLERY_DIR_DEFAULT
            )

            try {
              // 测试看存在不存在该组件
              fs.readdirSync(path.resolve(_galleryPathOrigin, name))
              exist = true //
              _galleryPath = gallery.path
              _galleryIgnoreFiles = gallery.ignoreFiles
              break
            } catch (error) {}
          }
        }

        // 根据md5值校验本地文件有无修改，有改过则给出提示

        if (exist) {
          const modifieds = isModified(
            name,
            _galleryPath,
            _galleryIgnoreFiles,
            _galleryPathOrigin,
            root
          )
          if (modifieds.modifyFiles.length) {
            modifiedGalleryArr.push(modifieds)
          }
        }
      } else {
        /**
         * 批量
         */
        for (const gallery of galleriesConfig) {
          if (!galleryRepos || galleryRepos.includes(gallery.repoName)) {
            // src/app/gallery
            const _galleryPath = gallery.path
            // node_modules下的原始gallery路径
            const _galleryPathOrigin = path.resolve(
              root,
              'node_modules',
              gallery.repoName,
              gallery.originPath || GALLERY_DIR_DEFAULT
            )

            // 单组件仓库
            if (gallery.single) {
              // 本地被修改过
              const modifieds = isModified(
                '',
                _galleryPath,
                gallery.ignoreFiles,
                _galleryPathOrigin,
                root
              )
              if (modifieds.modifyFiles.length) {
                modifiedGalleryArr.push(modifieds)
              }
            }

            // 多组件仓库
            else {
              // 组件文件夹
              const _gallerys = fs.readdirSync(_galleryPathOrigin)

              for (const galleryName of _gallerys) {
                // 忽略__打头的文件夹
                if (!notGalleryFolderRexp.test(galleryName)) {
                  const modifieds = isModified(
                    galleryName,
                    _galleryPath,
                    gallery.ignoreFiles,
                    _galleryPathOrigin,
                    root
                  )
                  if (modifieds.modifyFiles.length) {
                    modifiedGalleryArr.push(modifieds)
                  }
                }
              }
            }
          }
        }
      }

      emitter.emit('close', {
        data: modifiedGalleryArr
      })
    }, 0)

    return emitter
  },

  /**
   * params.cwd [string] 项目根目录
   */
  async list(params: any = {}) {
    const cwd = params.cwd

    if (!(await utils.isInAppRoot(cwd))) {
      throw new Error('请在项目根目录下执行本命令')
    }

    // 组件路径可配置在package.json的magixCliConfig里
    const magixCliConfig = await util.getMagixCliConfig(cwd)
    const root = await utils.getAppPath(cwd)

    const galleriesConfig = util.compatGalleriesConfig(magixCliConfig)

    for (const gallery of galleriesConfig) {
      gallery.list = []
      try {
        const _galleryPath = gallery.path
        const galleryFullPath = path.resolve(root, _galleryPath)
        const galleryFiles = fs.readdirSync(galleryFullPath)

        if (!galleryFiles.length) {
          break
        }

        galleryFiles.forEach(file => {
          const gallerySinglePath = path.resolve(galleryFullPath, file)
          try {
            const files = fs.readdirSync(gallerySinglePath)
            files.forEach(_file => {
              if (path.extname(_file) === '.js') {
                const version = getVersion(
                  path.resolve(galleryFullPath, file, _file)
                )

                gallery.list.push({
                  name: `${file}/${path.parse(_file).name}`,
                  version: version ? `v${version}` : ''
                })
              }
            })
          } catch (error) {}
        })
      } catch (error) {
        // if (error.code === 'ENOENT') {
        // }
      }
    }

    return galleriesConfig
  }
}
