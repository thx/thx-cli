import { install } from './commands/install'
import { uninstall } from './commands/uninstall'
import { info } from './commands/info'
import { addDomains } from './commands/addDomains'

export default async command => {
  if (command.info) {
    // 列出已配置的域名
    await info()
  } else if (command.uninstall) {
    // 删除本地生成的自签名证书
    await uninstall()
  } else if (command.add) {
    // 添加域名
    await addDomains(command.add)
  } else {
    // 主程：生成自签证书并写入系统钥匙串
    await install()
  }
}
