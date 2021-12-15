import { utils } from 'thx-cli-core'
import * as fse from 'fs-extra'
import * as chalk from 'chalk'
import * as util from './util'
import * as semver from 'semver'
import { prompt, QuestionCollection } from 'inquirer'
const { getTnpmPackage, IS_OPEN_SOURCE } = utils
const pkg = require('../../package.json')

/**
 * 检查本地node_modules里的包版本，跟package.json里的版本是否一致
 * 不一致给出提示
 */
export function checkPackageVersionsCorrect() {
  return new Promise(async (resolve, reject) => {
    const rootPath = await utils.getAppPath()
    const localPkg = fse.readJsonSync(rootPath + '/package.json')
    const unMatchPackages = []

    //
    function checkModules(deps = {}, unMatch) {
      for (const moduleName in deps) {
        const version = deps[moduleName]

        try {
          const modulePkg = fse.readJsonSync(
            `${rootPath}/node_modules/${moduleName}/package.json`
          )

          // 如果包版本是地址类型的，则跳过验证，如 "kmc": "git+ssh://git@gitlab.alibaba-inc.com:jintai.yzq/kmc.git"
          if (semver.validRange(version) === null) {
            break
          }

          // 本地安装的包版本不匹配package.json里的
          if (!semver.satisfies(modulePkg.version, version)) {
            modulePkg.newVersion = version
            modulePkg.name = moduleName
            unMatch.push(modulePkg)
          }
        } catch (error) {
          // 本地不存在的包
          if (error.code === 'ENOENT') {
            unMatch.push({
              name: moduleName,
              version: '本地未安装',
              newVersion: version || '未指定版本'
            })
          }
        }
      }
    }

    // 判断dev/dep里的包的版本
    checkModules(localPkg.dependencies, unMatchPackages)
    checkModules(localPkg.devDependencies, unMatchPackages)

    if (!unMatchPackages.length) {
      resolve(true)
    } else {
      // 本地安装的包版本与package.json里不符合的列出来
      if (unMatchPackages.length) {
        console.log(
          chalk.yellowBright(
            `\nⓘ 检测到本地 node_modules 包版本与 package.json 里不匹配，请重新 ${chalk.cyanBright(
              `${IS_OPEN_SOURCE ? 'npm install' : 'tnpm install'}`
            )} 安装`
          )
        )

        console.log(chalk.white('  以下是不匹配的包：'))
        unMatchPackages.forEach(module => {
          console.log(
            chalk.white(
              `  └─ ${module.name} ${chalk.grey(
                `(local-> ${module.version}, package.json-> ${module.newVersion})`
              )}`
            )
          )
        })
      }

      console.log('')
      resolve(false)
    }
  })
}

/**
 * 检测本地cli里的构建相关的包版本与线上builder-magix-combine构建器里是否一致
 * 本地与线上构建器里的版本都必须是精确指定版本，以防止版本不同导致的本地开发与线上打包不一致的问题
 */
export async function checkBuilder(isMagix5) {
  const pkgName = isMagix5
    ? '@ali/builder-magix-compose'
    : '@ali/builder-magix-combine'
  const latestPkg = await getTnpmPackage(pkgName)
  const dependencies = latestPkg.dependencies
  const localDependencies = pkg.dependencies
  const unmatchPkg = []

  for (const pkgName in dependencies) {
    if (
      localDependencies[pkgName] !== undefined &&
      dependencies[pkgName] !== localDependencies[pkgName]
    ) {
      unmatchPkg.push({
        pkgName,
        pkgVersion: dependencies[pkgName],
        pkgVersionLocal: localDependencies[pkgName]
      })
    }
  }

  if (unmatchPkg.length) {
    return {
      isMatch: false,
      unmatchPkg
    }
  } else {
    return {
      isMatch: true
    }
  }
}

/**
 * 构建器与套件依赖的包版本不一致，给出提示，并支持一键升级套件
 */
export async function checkBuilderUpdateTips(unmatchPkg = []) {
  // 版本不一致给出提示
  console.log(
    chalk.yellowBright(
      `ⓘ 本地 ${chalk.cyanBright(
        'Magix'
      )} 套件依赖的包与线上构建器版本不一致，可能导致编译差异问题`
    )
  )
  console.log(chalk.grey('  以下是版本不一致的包：'))

  unmatchPkg.forEach(pkg => {
    console.log(
      chalk.grey(
        `  ├── ${pkg.pkgName} ${chalk.grey(
          `(local: ${pkg.pkgVersionLocal}, builder: ${pkg.pkgVersion})`
        )}`
      )
    )
  })

  const questions: QuestionCollection = [
    {
      type: 'confirm',
      name: 'isUpdate',
      default: true,
      message: `请立即更新 ${chalk.cyanBright('Magix')} 套件`
    }
  ]
  const answer = await prompt(questions)
  if (answer.isUpdate) {
    await utils.spawnDowngradeSudo('mm', ['install', 'kit', 'magix'])
  }
}

/**
 * 检测gallery有无最新版可以更新，非强制升级
 */
export async function checkGalleryUpdate(magixCliConfig, log) {
  const galleries = util.compatGalleriesConfig(magixCliConfig)

  if (!galleries || !Array.isArray(galleries)) {
    return
  }

  const updaterGalleries = [] // 有新版的组件
  try {
    const getTnpmPkgPromises = []
    for (const gallery of galleries) {
      getTnpmPkgPromises.push(getTnpmPackage(gallery.repoName))
    }

    const latestPkgs = await Promise.all(getTnpmPkgPromises)

    for (const latestPkg of latestPkgs) {
      const galleryName = latestPkg.name

      // gallerys 配置里找到当前 gallery
      // gallerys 里配置的 name 有可能包括版本形式：@ali/zs_gallery@1.0.0
      const localGallery = galleries.find(g => {
        return g.repoName === galleryName
      })

      try {
        // 项目组件目录下存放着 pkg.json (同 node_modules 组件目录下的 package.json)
        const localGalleryPkg = await fse.readJson(
          `${localGallery.path}/pkg.json`
        )

        if (semver.lt(localGalleryPkg.version, latestPkg.version)) {
          updaterGalleries.push({
            name: galleryName,
            version: latestPkg.version,
            localVersion: localGalleryPkg.version
          })
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          // 本地未安装也列入更新
          updaterGalleries.push({
            name: galleryName,
            version: latestPkg.version,
            localVersion: '本地未安装'
          })
        }
      }
    }
  } catch (error) {
    // console.log('error', error)
  }

  if (updaterGalleries.length) {
    log(
      chalk.yellow(
        '\n♨ 检测到项目依赖的组件库有新版本(或未安装)，待更新组件库如下：'
      )
    )
    for (const gallery of updaterGalleries) {
      log(chalk.grey(`『组件库  ：${chalk.white(gallery.name)}`))
      log(chalk.grey(`  最新版本：${chalk.green(gallery.version)}`))
      log(chalk.grey(`  本地版本：${chalk.cyan(gallery.localVersion)} 』`))
      log(chalk.grey('---------------------'))
    }
    const questions = [
      {
        type: 'confirm',
        name: 'isUpdateGallery',
        message: chalk.green('【建议立即更新组件】:')
      }
    ]

    const { isUpdateGallery } = await prompt(questions)

    if (isUpdateGallery) {
      // tnpm install 禁止 SUDO 执行 （根据判断env.USER是否为 root），所以需要将 USER 设为其他值
      const rootUser = process.env.USER
      process.env.USER = ''

      // 更新组件
      await utils.spawnDowngradeSudo('mm', [
        'gallery',
        '--gallery-repos',
        updaterGalleries.map(g => g.name).join(',')
      ])
      process.env.USER = rootUser
    }
  }
}
