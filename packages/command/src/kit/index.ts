/**
 * MO 内置套件命令
 * 内置实现的套件命令
 * 配置格式遵循 commander 命令行工具
 * 多参数的以 [] 数组形式
 */
import defaultKitDev from './dev'
import { ICommandList } from 'thx-cli-core/types'

const commands: ICommandList = [defaultKitDev]

export default commands
