import * as fse from 'fs-extra'
import * as walk from 'walk'
import * as path from 'path'
import { ICreateAppInfo } from 'thx-cli-core/types'

export default {

  // 替换入口文件index.html等的title信息
  // 替换
  setNameConfig (group, name) {
    const packageFile = `${name}/package.json`
    const pkg = fse.readJsonSync(packageFile)

    try {
      for (const index of pkg.magixCliConfig.indexMatch) {
        const indexFile = `${name}/${index}`
        let result = fse.readFileSync(indexFile, 'utf8')
        result = result.replace(/thx\/scaffold/g, group + '/' + name)
          .replace(/\<title\>.*\<\/title\>/, '<title>' + name + '</title>') // 更改title

        fse.outputFileSync(indexFile, result, 'utf8')
      }
    } catch (error) { }

    try {
      // cell-components-scaffold里的example/index.html也进行下相关替换
      const cellIndexFile = name + '/example/index.html'
      const cellResult = fse.readFileSync(cellIndexFile, 'utf8')
        .replace(/cell-components-scaffold/g, name)

      fse.outputFileSync(cellIndexFile, cellResult, 'utf8')
    } catch (error) { }

    // 保留@ali/xxx等前缀
    pkg.name = pkg.name.replace(/(@.+\/)?.+/, `$1${name}`)
    fse.outputFileSync(packageFile, JSON.stringify(pkg, null, 4), 'utf8')
  },

  // 读取package.json，更改magixCliConfig配置
  setMagixCliConfig (key, value, name) {
    const packageFile = `${name}/package.json`
    const pkg = fse.readJsonSync(packageFile)

    pkg.magixCliConfig = pkg.magixCliConfig || {}
    pkg.magixCliConfig[key] = value
    fse.outputFileSync(packageFile, JSON.stringify(pkg, null, 4), 'utf8')
  },

  setPackage (key, value, name) {
    const packageFile = `${name}/package.json`
    const pkg = fse.readJsonSync(packageFile)

    pkg[key] = value
    fse.outputFileSync(packageFile, JSON.stringify(pkg, null, 4), 'utf8')
  },

  // spma在index.html里的meta同时设置下
  setSpma (value, name) {
    const packageFile = `${name}/package.json`
    const pkg = fse.readJsonSync(packageFile)

    try {
      const indexMatch = pkg.magixCliConfig.indexMatch
      for (const index of indexMatch) {
        const indexFile = `${name}/${index}`
        const data = fse.readFileSync(indexFile, 'utf8')
        const result = data.replace(/<meta name="spm-id" content=".*">/g, `<meta name="spm-id" content="${value}">`)
        fse.outputFileSync(indexFile, result, 'utf8')
      }
    } catch (error) { }
  },

  /**
       * 初始化项目后，进行全文件的项目名称的替换，目前只支持zs_scaffold脚手架
       */
  adjustProject (appInfo: ICreateAppInfo) {
    const { app: name, snapshoot } = appInfo
    const scaffoldName = snapshoot?.scaffoldInfo?.name

    return new Promise(async (resolve, reject) => {
      // 默认的zs_scaffold文件夹改成项目名称的
      const projectPath = `${process.cwd()}/${name}`
      await fse.move(`${projectPath}/src/${scaffoldName}`, `${projectPath}/src/${name}`)

      const walker = walk.walk(projectPath, {
        filters: ['.git', 'node_modules', '.mds']
      })

      walker.on('file', async (root, fileStats, next) => {
        const file = path.resolve(root, fileStats.name)
        let fileContent = await fse.readFile(file, 'utf8')
        const regExpScaffoldName = new RegExp(scaffoldName, 'g')
        fileContent = fileContent.replace(regExpScaffoldName, name)
        fse.outputFile(file, fileContent)

        // doStuff
        next()
      })

      walker.on('errors', function (root, nodeStatsArray, next) {
        next()
      })

      walker.on('end', function () {
        resolve(null)
      })
    })
  }
}
