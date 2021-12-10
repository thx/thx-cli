import { describe, it, after } from 'mocha'
import { spawn } from 'child_process'
import { expect } from 'chai'
import { utils } from '@ali/mm-cli-core'
import { SPAWN_OPTIONS, validSubProcess } from '../../core/test/shared'
const { getRmxConfig } = utils
const pkg = require('../package.json')

describe(pkg.name, () => {
  // const options: SpawnOptions = { stdio: 'pipe', cwd: process.cwd() }
  const options = SPAWN_OPTIONS

  after((done) => {
    done()
  })
  it('$ mm clear --clear', function (done) {
    this.timeout(5 * 1000)
    const subprocess = spawn('mm', ['clear', '--clear'], options)
    validSubProcess(subprocess, options, () => {
      const cliConfig = getRmxConfig()
      const pluginConfig = cliConfig[pkg.name]
      const { hosts } = pluginConfig
      expect(hosts).to.be.a('array').have.length(0)
      done()
    })
  })
  it('$ mm clear --add foo.com', function (done) {
    this.timeout(5 * 1000)
    const subprocess = spawn('mm', ['clear', '--add', 'foo.com'], options)
    validSubProcess(subprocess, options, () => {
      const cliConfig = getRmxConfig()
      const pluginConfig = cliConfig[pkg.name]
      const { hosts } = pluginConfig
      expect(hosts).to.be.a('array').have.length(1)
      done()
    })
  })
  it('$ mm clear --add http://foo.com', function (done) {
    this.timeout(5 * 1000)
    const subprocess = spawn('mm', ['clear', '--add', 'foo.com'], options)
    validSubProcess(subprocess, options, () => {
      const cliConfig = getRmxConfig()
      const pluginConfig = cliConfig[pkg.name]
      const { hosts } = pluginConfig
      expect(hosts).to.be.a('array').have.length(1)
      done()
    })
  })
  it('$ mm clear --add bar.com,faz.com', function (done) {
    this.timeout(5 * 1000)
    const subprocess = spawn('mm', ['clear', '--add', 'bar.com,faz.com'], options)
    validSubProcess(subprocess, options, () => {
      const cliConfig = getRmxConfig()
      const pluginConfig = cliConfig[pkg.name]
      const { hosts } = pluginConfig
      expect(hosts).to.be.a('array').have.length(3)
      done()
    })
  })
  it('$ mm clear --add http://bar.com,https://faz.com', function (done) {
    this.timeout(5 * 1000)
    const subprocess = spawn('mm', ['clear', '--add', 'bar.com,faz.com'], options)
    validSubProcess(subprocess, options, () => {
      const cliConfig = getRmxConfig()
      const pluginConfig = cliConfig[pkg.name]
      const { hosts } = pluginConfig
      expect(hosts).to.be.a('array').have.length(3)
      done()
    })
  })
  it('$ mm clear --list', function (done) {
    this.timeout(5 * 1000)
    const subprocess = spawn('mm', ['clear', '--list'], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
  it('$ mm clear foo.com', function (done) {
    this.timeout(5 * 1000)
    const subprocess = spawn('mm', ['clear', 'foo.com'], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
  it('$ mm clear', function (done) {
    this.timeout(50 * 1000)
    const subprocess = spawn('mm', ['clear'], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
})
