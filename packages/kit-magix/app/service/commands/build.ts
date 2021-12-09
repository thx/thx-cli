import { utils } from 'thx-cli-core'
import * as chalk from 'chalk'
import * as gulp from 'gulp'
import * as del from 'del'
import * as gulpEsbuild from 'gulp-esbuild'
import * as cleanCSS from 'gulp-clean-css'
import * as combineTool from 'magix-combine'
import * as composerTool from 'magix-composer'
import * as magixCombineToolConfig from 'magix-combine-tool-config'
import * as magixComposerToolConfig from 'magix-composer-config'

// 本地构建
export default async command => {
  const startTimeTotal = timekeepingStart()
  const pkg = await utils.getAppPkg()
  const magixCliConfig = pkg.magixCliConfig || {}
  const isMagix5 = magixCliConfig.magixVersion === '5' // magix5 标识

  const { magixCombineConfig = {} } = magixCliConfig // 项目自定义配置magix-combine
  Object.assign(magixCombineConfig, {
    log: true,
    checker: true,
    debug: true
  })

  let srcFolder, buildFolder, magixCombineTool, combineToolConfig

  if (isMagix5) {
    magixCombineTool = composerTool
    combineToolConfig = await magixComposerToolConfig(pkg, magixCombineConfig)
    srcFolder = combineToolConfig.commonFolder
    buildFolder = combineToolConfig.compiledFolder
  } else {
    magixCombineTool = combineTool
    combineToolConfig = await magixCombineToolConfig(pkg, magixCombineConfig)
    srcFolder = combineToolConfig.tmplFolder
    buildFolder = combineToolConfig.srcFolder
  }

  magixCombineTool.config(combineToolConfig)

  function build() {
    return new Promise((resolve, reject) => {
      console.log(chalk.gray('压缩js文件'))
      // 压缩合并后的html,js,css文件
      gulp
        .src(buildFolder + '/**/*.js')
        .pipe(
          gulpEsbuild({
            minify: true,
            target: magixCliConfig.esBuildTarget || ['es2018'],
            define: { DEBUG: 'false' }
          })
        )
        .on('error', e => {
          reject(e)
          // throw new Error(e);
        })
        .pipe(gulp.dest(buildFolder))
        .on('end', e => {
          console.log(chalk.gray('拷贝非js,html,less文件拷到build下'))
          // 非js,html,less文件拷到build下
          gulp
            .src([
              srcFolder + '/**/*.*',
              '!' + srcFolder + '/**/*.js',
              '!' + srcFolder + '/**/*.ts',
              '!' + srcFolder + '/**/*.es',
              '!' + srcFolder + '/**/*.html',
              '!' + srcFolder + '/**/*.less',
              '!' + srcFolder + '/**/*.css',
              '!' + srcFolder + '/**/*.scss',
              '!' + srcFolder + '/**/*.mx'
            ])
            .pipe(gulp.dest(buildFolder))
            .on('end', e => {
              console.log(chalk.gray('压缩并拷贝.css文件到build下'))
              // css文件先压缩再拷贝
              gulp
                .src([srcFolder + '/**/*.css'])
                .pipe(cleanCSS({ compatibility: 'ie8' }))
                .pipe(gulp.dest(buildFolder))
                .on('end', e => {
                  resolve(null)
                })
            })
        })
    })
  }

  // 计时开始
  function timekeepingStart() {
    return new Date().getTime()
  }

  // 计时结束
  function timekeepingEnd(startTime) {
    const endTime = new Date().getTime()
    return Math.round((endTime - startTime) / 1000)
  }

  try {
    // 删除
    await del(buildFolder)

    // 合并html,js,css文件
    // magixCombineTool.config({
    //   debug: false
    // })

    // magix-combine 编译
    const startTime = timekeepingStart()
    await magixCombineTool.combine()
    console.log(
      chalk.grey(`magix-combine 编译耗时：${timekeepingEnd(startTime)} 秒`)
    )

    // 代码压缩
    const _startTime = timekeepingStart()
    await build()
    console.log(
      chalk.grey(`esbuild 代码压缩耗时：${timekeepingEnd(_startTime)} 秒`)
    )

    console.log(chalk.green('项目代码构建完毕!'))
    console.log(chalk.grey(`构建总耗时：${timekeepingEnd(startTimeTotal)}秒`))
  } catch (error) {
    console.log(chalk.red(`代码构建失败：${error}`))
  }
}
