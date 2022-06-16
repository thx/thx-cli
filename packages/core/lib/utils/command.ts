// MO TODO 命令工具：define-commands
// 通用注册、套件命令注册、插件命令注册

import { getMMConfig, setMMConfig } from './mm'

/**
 * 是否因为模块过期需要阻塞任务？
 * 一周强提示升级一次，其他时间弱提示
 */
export function needBlockProcessByModuleOutdated(pkgName: string) {
  const mmConfig = getMMConfig()
  const now = Date.now()
  const week = 1000 * 60 * 60 * 24 * 7 // 7天
  const CHECK_KEY = '__unstable_check_outdated_at'

  if (!mmConfig[CHECK_KEY]) {
    mmConfig[CHECK_KEY] = {}
  }

  if (
    !mmConfig[CHECK_KEY][pkgName] ||
    now - mmConfig[CHECK_KEY][pkgName] > week
  ) {
    mmConfig[CHECK_KEY][pkgName] = now
    setMMConfig(mmConfig)
    return true
  }
}

// 判断是否跳过版本升级校验所调用的 tnpm 包查询接口
// 规则：一天内只校验一次
export function skipCheckNpmPackage() {
  const mmConfig = getMMConfig()

  const now = Date.now()
  const period = 1000 * 60 * 60 * 24 // 24小时
  const CHECK_KEY = '__skip_check_npm_package_at'

  if (
    mmConfig[CHECK_KEY] &&
    now - mmConfig[CHECK_KEY] < period // 24小时内
  ) {
    return true
  } else {
    mmConfig[CHECK_KEY] = now
    setMMConfig(mmConfig)
    return false
  }
}
