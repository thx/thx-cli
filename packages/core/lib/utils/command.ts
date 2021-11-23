// MO TODO 命令工具：define-commands
// 通用注册、套件命令注册、插件命令注册

import { getMMConfig, setMMConfig } from './mm'

/**
 * 是否因为模块过期需要阻塞任务？
 */
export function needBlockProcessByModuleOutdated (pkgName: string) {
  const mmConfig = getMMConfig()
  const now = Date.now()
  const week = 1000 * 60 * 60 * 24 * 7
  if (!mmConfig.__unstable_check_outdated_at) mmConfig.__unstable_check_outdated_at = {}
  if (!mmConfig.__unstable_check_outdated_at[pkgName] || now - mmConfig.__unstable_check_outdated_at[pkgName] > week) {
    mmConfig.__unstable_check_outdated_at[pkgName] = now
    setMMConfig(mmConfig)
    return true
  }
}
