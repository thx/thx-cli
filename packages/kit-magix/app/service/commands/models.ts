'use strict'
/**
 * 从RAP上同步接口到本地项目中
 */

import * as chalk from 'chalk'
import { CommanderStatic } from 'commander'
import * as inquirer from 'inquirer' // A collection of common interactive command line user interfaces.
import modelsApi from '../apis/models'

export default async (command: CommanderStatic) => {
  let answers: any = {}
  const resp = await modelsApi.check()

  if (resp.error) {
    return console.log(chalk.red(`✘ ${resp.error}`))
  }

  const noMatchAPis = resp.data.noMatchAPis || []
  if (noMatchAPis.length) {
    console.log(chalk.yellow('ⓘ 检测到本地以下接口在RAP平台上被删除或修改过：'))
    noMatchAPis.forEach(model => {
      console.log(chalk.grey(' ├──'), chalk.cyan(model.url), chalk.grey(model.method))
    })

    const questions = [{
      type: 'confirm',
      name: 'confirm',
      message: chalk.red('确定要继续同步接口到本地吗? (会存在页面中调用的接口不存在的风险)')
    }
      //     , {
      //     when(_answers) {
      //         return _answers.confirm
      //     },
      //     type: 'input',
      //     name: 'commitMsg',
      //     message: chalk.red(`此操作属于高危操作，请输入说明信息${chalk.grey(`(该信息会以commit形式提交)`)}`),
      //     validate(msg) {
      //         if (!msg.trim()) {
      //             return '必填'
      //         } else {
      //             return true
      //         }
      //     }
      // }
    ]
    answers = await inquirer.prompt(questions)
    if (!answers.confirm) {
      return
    }
  }

  modelsApi
    .exec(resp.data)
    .on('data', msg => {
      console.log(msg)
    })
    .on('close', resp => {
      if (resp.error) {
        console.log(chalk.red(`✘ ${resp.error}`))
      }
    })
}
