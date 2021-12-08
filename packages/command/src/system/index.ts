/**
 * 内置系统命令
 * 配置格式遵循 commander 命令行工具
 * 多参数的以 [] 数组形式
 */

// import systemLogin from './login'
// import systemLogout from './logout'
// import systemAdd from './add'
// import systemWeb from './web'
import systemInstall from './install'
import systemUninstall from './uninstall'
import systemInit from './init'
import systemList from './list'
import { ICommandList } from 'thx-cli-core/types'

const commands: ICommandList = [
  // systemLogin,
  // systemLogout,
  // systemAdd,
  // systemWeb,
  systemInstall,
  systemUninstall,
  systemInit,
  systemList
]

export default commands
