import { grey, blueBright } from 'chalk'
import cert from './cert'

export default async () => {
  // 配置遵循 commander
  const plugin = {
    command: 'cert',
    description: '一键生成自签名证书并添加到 macOS 钥匙串',
    options: [
      ['--info', '查看自签名证书支持的域名信息'],
      ['-a, --add <host>', '添加要支持的域名，多个域名以逗号分隔'],
      ['-uni, --uninstall', '删除生成的 SSL 密钥和自签名证书']
    ],
    async action(command) {
      await cert(command)
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
