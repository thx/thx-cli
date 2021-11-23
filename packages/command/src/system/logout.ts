import { utils } from '@ali/mm-cli-core'
import { ICommandConfig } from '@ali/mm-cli-core/types'
import { blueBright, green, grey } from 'chalk'
import { CommanderStatic } from 'commander'

async function commandAction (command) {
  utils.setConfig('user', {})
  console.log(green('✔ 已登出'))
}

/**
 * 退出登录
 */
const commandConfig: ICommandConfig = {
  command: 'logout',
  description: '退出域账号',
  // 必须为异步方法
  async action (command: CommanderStatic) {
    await commandAction(command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm logout')}`)
    }]
  ]
}

export default commandConfig
