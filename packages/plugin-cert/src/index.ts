import { grey, blueBright } from 'chalk'
import cert from './cert'

export default async rmx => {
  // rmx.util提供了一些帮助方法
  // rmx.gitlab.xxx提供了各平台相关的一些接口
  // rmx.setConfig，rmx.getConfig 可以进行插件的一些配置的保存与读取
  // rmx.getRootConfig 获取rmx-cli级配置，如user用户信息

  // 配置遵循commander
  const plugin = {
    command: 'cert',
    description: '一键生成自签名证书并添加到 macOS 钥匙串',
    options: [
      [
        '-i, --install',
        '生成 SSL 密钥和自签名证书，在系统钥匙串里添加和信任自签名证书'
      ],
      ['--info', '查看自签名证书信息'],
      ['--trust', '信任自签名证书'],
      ['-a, --add <host>', '添加要支持的域名，多个域名以逗号分隔'],
      ['-uni, --uninstall', '删除生成的 SSL 密钥和自签名证书']
    ],
    async action(command) {
      await cert(command, rmx)
    },
    on: [
      [
        '--help',
        () => {
          console.log('\nExamples:')
          console.log(`  ${grey('$')} ${blueBright('mm cert')}`)
          console.log()
        }
      ]
    ]
  }

  return plugin
}
