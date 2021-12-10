'use strict'
/**
 * 将node_modules下的magix-gallery同步到本地项目中gallery下
 *  - mm gallery: 默认同步所有组件到本地项目中，如果有本地组件被修改过，给出提示，来决定是否覆盖升级
 *  - mm gallery -n <galleryName>: 指定同步某个组件，如果本地有组件有修改过，给出提示
 *  - mm gallery -l: 列出本地所有组件以及组件版本号
 */
import * as chalk from 'chalk'
import * as inquirer from 'inquirer' // A collection of common interactive command line user interfaces.
import { gallery as galleryApi } from 'thx-magix-scripts'

export default async options => {
  const { list, galleryRepos, galleryName } = options

  async function modifiedTips(modifieds, tips) {
    console.log(chalk.yellow('ⓘ 检测到本地组件以下文件有被修改过：'))
    modifieds.forEach(mod => {
      mod.modifyFiles.forEach(file => {
        console.log(
          chalk.grey(' ├──'),
          chalk.cyan(
            `${file.filePath}${chalk.grey(' - ')}${
              file.type === 'deleted'
                ? chalk.red(`[${file.type}]`)
                : chalk.yellow(`[${file.type}]`)
            }`
          )
        )
      })
    })
    console.log()

    const questions = [
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.green(tips)
      }
    ]
    const answers = await inquirer.prompt(questions)

    return answers.confirm
  }

  // 列出所有本地组件
  if (list) {
    try {
      const gallerys = await galleryApi.list()
      console.log(chalk.white('↳以下是项目中所有gallery组件信息：'))
      for (const gallery of gallerys) {
        console.log(
          chalk.green(` 组件库[${gallery.repoName}]`),
          chalk.grey(`${gallery.path}`)
        )
        for (const g of gallery.list) {
          console.log(
            chalk.grey(
              ` ├── ${chalk.cyan(g.name)} ${chalk.grey(`${g.version}`)}`
            )
          )
        }
      }
    } catch (error) {
      console.log(chalk.red(`✘ ${error}`))
    }
  }

  // 同步单个或全部组件
  else {
    let modifiedGalleryArr = []
    const updateGalleryRepos = galleryRepos && galleryRepos.split(',')
    galleryApi
      .check({
        name: galleryName,
        galleryRepos: updateGalleryRepos,
        pkgManager: 'npm'
      })
      .on('data', msg => {
        console.log(msg)
      })
      .on('close', async resp => {
        if (resp.error) {
          return console.log(chalk.red(`✘ ${resp.error}`))
        }

        modifiedGalleryArr = resp.data

        // 有本地修改过的，给出提示
        let isConfirm = true
        if (modifiedGalleryArr.length) {
          isConfirm = await modifiedTips(
            modifiedGalleryArr,
            '确认要覆盖升级吗？(选择 no 则只升级本地未修改过的组件)'
          )
        }

        galleryApi
          .exec({
            name: galleryName,
            isIgnoreModify: !isConfirm, // 是否忽略本地修改过的组件
            modifiedGallerys: modifiedGalleryArr, // 本地有修改的组件列表
            galleryRepos: updateGalleryRepos
          })
          .on('data', msg => {
            console.log(msg)
          })
          .on('close', _resp => {
            if (_resp.error) {
              return console.log(chalk.red(`✘ ${_resp.error}`))
            }
          })
      })
  }
}
