/**
 * 内置系统命令
 * 配置格式遵循 commander 命令行工具
 * 多参数的以 [] 数组形式
 */

import systemLogin from './login'
import systemLogout from './logout'
import systemInstall from './install'
import systemUninstall from './uninstall'
import systemInit from './init'
import systemAdd from './add'
import systemList from './list'
import systemWeb from './web'
import { ICommandList } from '@ali/mm-cli-core/types'

const commands: ICommandList = [
  systemLogin,
  systemLogout,
  systemInstall,
  systemUninstall,
  systemInit,
  systemAdd,
  systemList,
  systemWeb
]

export default commands
