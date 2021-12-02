import { ICommandConfig } from 'thx-cli-core/types'
import { CommanderStatic } from 'commander'

async function commandAction (command: CommanderStatic) {
  console.warn('TODO')
}

/**
 * 内置测试命令
 */
const commandConfig: ICommandConfig = {
  command: 'test',
  description: '执行测试用例',
  // 必须为异步方法
  async action (command: CommanderStatic) {
    return commandAction(command)
  }
}

export default commandConfig
