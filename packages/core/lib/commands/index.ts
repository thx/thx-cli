// 系统命令 actions
// MO TODO 目录命令不合理，commands => commands/actions
// MO FIXED 是否有必要通过 index.ts 导出？
export { default as init } from './init'
export { default as install } from './install'
export { default as uninstall } from './uninstall'
export { default as build } from './build'
export { default as daily } from './daily'
export { default as publish } from './publish'
