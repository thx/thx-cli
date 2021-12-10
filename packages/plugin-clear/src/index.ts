/**
 * 一键清除chrome的hsts及dns缓存
 */
import { CommanderStatic } from 'commander'
import { blueBright, grey } from 'chalk'
import clear from './clear'
import { ICommandConfig } from 'thx-cli-core/types'
export { clear }

export default async function () {
  const plugin: ICommandConfig = {
    name: 'clear',
    command: 'clear [host[,host]]',
    description: '一键清除 Chrome 的 DNS 以及 HSTS 缓存',
    options: [
      ['-a, --add <host[,host]>', '增加域名配置（多域名以逗号分隔）'],
      ['-c, --clear', '清除掉所有域名配置'],
      ['-l, --list', '列出当前配置过的所有域名']
    ],
    async action(hosts: string, command: CommanderStatic) {
      await clear(hosts, command)
    },
    on: [
      [
        '--help',
        () => {
          console.log('\nExamples:')
          console.log(`  ${grey('$')} ${blueBright('mm clear')}`)
          console.log()
        }
      ]
    ]
  }

  return plugin
}
