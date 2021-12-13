/**
 * 根据已存在的版本最大的daily分支来+1创建新的开发分支，避免多人开发分支重复创建冲突
 */
import { CommanderStatic } from 'commander'
import { blueBright, grey } from 'chalk'
import create from './create'

export default async (rmx) => {
  const plugin = {
    name: 'createDaily',
    command: 'createDaily',
    description: '自动创建 daily 分支，可以选择时间戳或指定版本形式，避免多人协作分支冲突问题。',
    alias: 'cd',
    options: [
      ['-n, --branch <branch>', '设置语义化的分支名称'],
      ['-t, --timestamp', '是否是时间戳形式分支']
    ],
    async action (command: CommanderStatic) {
      create(command, rmx)
    },
    on: [
      ['--help', () => {
        console.log('\nExamples:')
        console.log(`  ${grey('$')} ${blueBright('mm createDaily')}`)
        console.log()
      }]
    ]
  }

  return plugin
}
