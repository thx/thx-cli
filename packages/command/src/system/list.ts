import { utils } from 'thx-cli-core'
import { IModuleType, IKitInfo, IPluginInfo, ICommandConfig } from 'thx-cli-core/types'
import { blueBright, cyan, greenBright, grey, white } from 'chalk'
import { CommanderStatic } from 'commander'
import logger from '../logger'
const { MODULE_TYPE_MAP, CLI_NAME } = utils

function printToFileAndConsole (arg, ...args) {
  console.log(arg, ...args)
  logger.info(arg, ...args)
}
// ┌ └ ┐ ┘ ─ │ ├ ┤ ┬ ┴ ┼
function info (module: IKitInfo | IPluginInfo) {
  printToFileAndConsole(cyan(`   ${module.name} ${greenBright(module.version ? '[已安装]' : '')}`))
  printToFileAndConsole(grey(`   ├── ${white(module.description)}`))
  if (module.package) {
    printToFileAndConsole(grey(`   ├── ${grey(module.package)}`))
    printToFileAndConsole(grey(`   ├── ${grey.underline(`https://www.npmjs.com/package/${module.package}`)}`))
  }
  if (module.version) {
    printToFileAndConsole(grey(`   └── 本地版本: ${white(module.version)}, 最新版本: ${greenBright(module.latest)}`))
  }
}

// MO TODO 参考 yarn outdated 的输出
async function commandAction (type: IModuleType | undefined, command: CommanderStatic) {
  const { kits, plugins } = await utils.getModuleList()
  const { json, table } = command
  if (json) {
    printToFileAndConsole(JSON.stringify({ kits, plugins }, null, 2))
    return
  }
  if (table) {
    console.log(blueBright(`🚀 ${MODULE_TYPE_MAP.kit}列表：`))
    console.table(kits, ['name', 'title', 'version', 'latest'])
    console.log(blueBright(`🚀 ${MODULE_TYPE_MAP.plugin}列表：`))
    console.table(plugins, ['name', 'title', 'version', 'latest'])
    return
  }
  if (type === undefined || type === 'kit') {
    printToFileAndConsole(blueBright(`🚀 ${MODULE_TYPE_MAP.kit}列表：`))
    for (const kit of kits) info(kit)
  }
  if (type === undefined || type === 'plugin') {
    printToFileAndConsole(blueBright(`🧩 ${MODULE_TYPE_MAP.plugin}列表：`))
    for (const plugin of plugins) info(plugin)
  }
}

const commandConfig: ICommandConfig = {
  name: 'list',
  command: 'list [kit|plugin]',
  alias: 'l',
  options: [
    ['--json', '输出 JSON'],
    ['--table', '输出表格']
  ],
  description: '列出本地已安装的套件和插件',
  async action (type: IModuleType, command: CommanderStatic) {
    await commandAction(type, command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright(`${CLI_NAME} list`)}`)
    }]
  ]
}

export default commandConfig
