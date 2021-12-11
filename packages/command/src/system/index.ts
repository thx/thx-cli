/**
 * 内置系统命令
 * 配置格式遵循 commander 命令行工具
 * 多参数的以 [] 数组形式
 */

import systemInstall from './install'
import systemUninstall from './uninstall'
import systemInit from './init'
import systemList from './list'
import { ICommandList } from 'thx-cli-core/types'

const commands: ICommandList = [
  systemInstall,
  systemUninstall,
  systemInit,
  systemList
]

export default commands
