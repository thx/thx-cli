// https://mochajs.org/
// https://www.chaijs.com/api/bdd/
import { spawn, spawnSync } from 'child_process'
import { describe, after, it } from 'mocha'
import { expect } from 'chai'
import { validSubProcess, validSpawnSyncResult, SPAWN_OPTIONS } from '../../core/test/shared'
const pkg = require('../package.json')

describe(`${pkg.name}: mm list`, () => {
  after((done) => {
    done()
  })

  it('$ mm list', function (done) {
    this.timeout(30 * 1000)
    const subprocess = spawn('mm', ['list'], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, done)
  })
  it('$ mm list --json', function (done) {
    this.timeout(30 * 1000)
    // https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
    const result = spawnSync('mm', ['list', '--json'], { stdio: 'pipe' })
    validSpawnSyncResult(result)

    // console.log(result.stdout.toString())
    const modules = JSON.parse(result.stdout.toString())
    expect(modules).to.be.a('object').have.all.keys('kits', 'plugins')

    const { kits, plugins } = modules
    expect(kits).to.be.a('array').have.length.above(0)
    kits.forEach(kit => {
      expect(kit).be.a('object').include.all.keys('type', 'name', 'title', 'description', 'package', 'scaffolds') // 'localVersion', 'latestVersion'
    })

    expect(plugins).to.be.a('array').have.length.above(0)
    plugins.forEach(plugin => {
      expect(plugin).be.a('object').include.all.keys('type', 'name', 'title', 'description', 'package', 'command') // 'localVersion', 'latestVersion'
    })
    done()
  })
})
