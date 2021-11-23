import { describe, it, after, afterEach, before } from 'mocha'
import { join } from 'path'
import * as fse from 'fs-extra'
import { spawn } from 'child_process'
import { PLAYGROUND, SPAWN_OPTIONS, validSubProcess } from '../../core/test/shared'
import { expect } from 'chai'
const pkg = require('../package.json')

describe(`${pkg.name}: mm init`, () => {
  const appName = `mm_test_${Math.random().toFixed(8)}`

  before(function (done) {
    this.timeout(50 * 1000)
    fse.emptyDirSync(PLAYGROUND)
    done()
  })

  after((done) => {
    const exists = fse.existsSync(join(PLAYGROUND, appName))
    expect(exists).to.be.eq(false)
    fse.emptyDirSync(PLAYGROUND)
    done()
  })
  afterEach(function (done) {
    this.timeout(20 * 1000)
    fse.removeSync(join(PLAYGROUND, appName))
    const exists = fse.existsSync(join(PLAYGROUND, appName))
    expect(exists).to.be.equal(false)
    done()
  })

  it('$ mm init dev(kit)', function (done) {
    this.timeout(50 * 1000)
    const args = [
      `--app ${appName}`,
      '--gitlab false',
      '--group mmfs-playground',
      '--scaffold git@gitlab.alibaba-inc.com:mmfs/mm-cli.git',
      '--branch refactor_playground',
      '--directory packages/scaffold-dev-kit',
      '--rap false',
      '--def false',
      '--iconfont false',
      '--chartpark false',
      '--spma false',
      '--clue false',
      '--install false'
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['init', 'dev', ...args], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, () => {
      const exists = fse.existsSync(join(PLAYGROUND, appName))
      expect(exists).to.be.equal(true)
      done()
    })
  })

  it('$ mm init dev(plugin)', function (done) {
    this.timeout(50 * 1000)
    const args = [
      `--app ${appName}`,
      '--gitlab false',
      '--group mmfs-playground',
      '--scaffold git@gitlab.alibaba-inc.com:mmfs/mm-cli.git',
      '--branch refactor_playground',
      '--directory packages/scaffold-dev-plugin',
      '--rap false',
      '--def false',
      '--iconfont false',
      '--chartpark false',
      '--spma false',
      '--clue false',
      '--install false'
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['init', 'dev', ...args], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, () => {
      const exists = fse.existsSync(join(PLAYGROUND, appName))
      expect(exists).to.be.equal(true)
      done()
    })
  })

  it('$ mm init react', function (done) {
    this.timeout(50 * 1000)
    const args = [
      `--app ${appName}`,
      '--gitlab false',
      '--group mmfs-playground',
      '--scaffold git@gitlab.alibaba-inc.com:mmfs/rmagix-template.git',
      '--rap false',
      '--def false',
      '--iconfont false',
      '--chartpark false',
      '--spma false',
      '--clue false',
      '--install false'
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['init', 'react', ...args], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, () => {
      const exists = fse.existsSync(join(PLAYGROUND, appName))
      expect(exists).to.be.equal(true)
      done()
    })
  })
  it('$ mm init magix', function (done) {
    this.timeout(50 * 1000)
    const args = [
      `--app ${appName}`,
      '--gitlab false',
      '--group mmfs-playground',
      '--scaffold git@gitlab.alibaba-inc.com:mm/zs_scaffold.git',
      '--rap false',
      '--def false',
      '--iconfont false',
      '--chartpark false',
      '--spma false',
      '--clue false',
      '--install false'
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['init', 'magix', ...args], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, () => {
      const exists = fse.existsSync(join(PLAYGROUND, appName))
      expect(exists).to.be.equal(true)
      done()
    })
  })

  it('$ mm init cell(lib)', function (done) {
    this.timeout(50 * 1000)
    const args = [
      `--app ${appName}`,
      '--gitlab false',
      '--group mmfs-playground',
      '--scaffold git@gitlab.alibaba-inc.com:cell/cell-rollup-frame.git',
      '--branch cell-lib',
      '--install false'
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['init', 'cell', ...args], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, () => {
      const exists = fse.existsSync(join(PLAYGROUND, appName))
      expect(exists).to.be.equal(true)
      done()
    })
  })
  it('$ mm init cell(ui)', function (done) {
    this.timeout(50 * 1000)
    const args = [
      `--app ${appName}`,
      '--gitlab false',
      '--group mmfs-playground',
      '--scaffold git@gitlab.alibaba-inc.com:cell/cell-rollup-frame.git',
      '--branch cell-ui',
      '--install false'
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['init', 'cell', ...args], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, () => {
      const exists = fse.existsSync(join(PLAYGROUND, appName))
      expect(exists).to.be.equal(true)
      done()
    })
  })

  it('$ mm add react', function (done) {
    this.timeout(50 * 1000)
    const args = [
      `--module ${appName}`,
      '--template git@gitlab.alibaba-inc.com:mmfs/mm-cli.git',
      '--directory packages/core/lib',
      '--branch master',
      '--output .'
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['add', 'react', ...args], SPAWN_OPTIONS)
    validSubProcess(subprocess, SPAWN_OPTIONS, () => {
      const exists = fse.existsSync(join(PLAYGROUND, appName))
      expect(exists).to.be.equal(true)
      done()
    })
  })
})
