import { install } from './commands/install'
import { uninstall } from './commands/uninstall'
import { info } from './commands/info'
import { addDomains } from './commands/addDomains'

export default async command => {
  // 列出已配置的域名
  if (command.info) {
    await info()
  }

  // 删除本地生成的自签名证书
  else if (command.uninstall) {
    await uninstall()
  }

  // 添加域名
  else if (command.add) {
    await addDomains(command.add)
  }

  // 主程：生成自签证书并写入系统钥匙串
  else {
    await install()
  }
}
