import * as fse from 'fs-extra'
import { uninstall } from './uninstall'
import { install } from './install'
import { SSL_CONFIG_FILE, SSL_CRT_PATH } from '../config/index'

export async function addDomains(domainsStr = '') {
  let domains = domainsStr.split(',').map(item => item.trim())

  let configs = {
    domains: []
  }

  // 现有的配置domains
  if (await fse.pathExists(SSL_CONFIG_FILE)) {
    configs = await fse.readJson(SSL_CONFIG_FILE)
  }

  // 去重合并domains
  for (const domain of domains) {
    if (!configs.domains.includes(domain)) {
      configs.domains.push(domain)
    }
  }

  // 重新安装自签证书
  await install(configs.domains)
}
