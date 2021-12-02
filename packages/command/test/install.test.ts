import { describe, it } from 'mocha'
import { join } from 'path'
import * as fse from 'fs-extra'
import { spawn, SpawnOptions } from 'child_process'
import { SPAWN_OPTIONS, validSubProcess } from '../../core/test/shared'
import { expect } from 'chai'
import { utils } from 'thx-cli-core'
const pkg = require('../package.json')
const { RMX_HOME } = utils

//  '@ali/mm-kit-react', '@ali/mm-kit-magix'
const SUB_COMMAND_LIST = [
  // exists, subCommand
  [false, 'uninstall'],
  [true, 'install']
]

const options: SpawnOptions = {
  ...SPAWN_OPTIONS,
  env: { ...SPAWN_OPTIONS.env, MM_MODE: 'development' }
}

describe(`${pkg.name}: mm install kit`, () => {
  const KIT_LIST = [
    // folder, kitName | kigPkgName
    ['dev', 'dev'],
    ['dev', '@ali/mm-kit-dev'],
    ['react', 'react'],
    ['react', '@ali/mm-kit-react'],
    ['magix', 'magix'],
    ['magix', '@ali/mm-kit-magix'],
    ['cell', 'cell'],
    ['cell', '@ali/mm-kit-cell']
  ]
  SUB_COMMAND_LIST.forEach(([exists, subCommand]: [boolean, string]) => {
    KIT_LIST.forEach(([folder, kit]) => {
      it(`$ mm ${subCommand} kit ${kit}`, function (done) {
        this.timeout(30 * 1000)
        const subprocess = spawn('mm', [subCommand, 'kit', kit], options)
        validSubProcess(subprocess, options, () => {
          const actural = fse.existsSync(join(RMX_HOME, 'kit', folder))
          expect(actural).to.be.equal(exists)
          done()
        })
      })
    })
  })
})

describe(`${pkg.name}: mm install plugin`, () => {
  const PLUGIN_LIST = [
    // folder, pluginName | pluginPkgName
    ['createDaily', 'createDaily'],
    ['createDaily', '@ali/mm-plugin-create-daily'],
    ['clear', 'clear'],
    ['clear', '@ali/mm-plugin-clear'],
    ['magixBuild', 'magixBuild'],
    ['magixBuild', '@ali/mm-plugin-magix-build'],
    ['cert', 'cert'],
    ['cert', '@ali/mm-plugin-cert']
  ]
  SUB_COMMAND_LIST.forEach(([exists, subCommand]: [boolean, string]) => {
    PLUGIN_LIST.forEach(([folder, plugin]) => {
      it(`$ mm ${subCommand} plugin ${plugin}`, function (done) {
        this.timeout(30 * 1000)
        const subprocess = spawn('mm', [subCommand, 'plugin', plugin], options)
        validSubProcess(subprocess, options, () => {
          const actural = fse.existsSync(join(RMX_HOME, 'plugin', folder))
          expect(actural).to.be.equal(exists)
          done()
        })
      })
    })
  })
})
