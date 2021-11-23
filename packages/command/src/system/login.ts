import { CommanderStatic } from 'commander'
import { utils, gitlab } from '@ali/mm-cli-core'
import { ICommandConfig } from '@ali/mm-cli-core/types'
import { blueBright, green, grey } from 'chalk'

async function commandAction (command: CommanderStatic) {
  const user: any = utils.getConfig('user') || {}
  const { extern_uid: uid, name } = user
  if (user && uid && name) {
    console.log(green(`✔ ${name} ${uid} 已登录。`))
    return
  }
  await gitlab.login()
}

/**
 * 用户登录
 */
const commandConfig: ICommandConfig = {
  command: 'login',
  description: '登录域账号',
  async action (command: CommanderStatic) {
    await commandAction(command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm login')}`)
    }]
  ]
}

export default commandConfig
