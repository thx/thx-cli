import { describe, it, after } from 'mocha'
import { utils } from 'thx-cli-core'
import { spawn, SpawnOptions } from 'child_process'
import { EXAMPLE_MAGIX, SPAWN_OPTIONS, validSubProcess } from '../../core/test/shared'
import fetch from 'node-fetch'
const pkg = require('../package.json')
const { RMX_PORT } = utils

const TEST_PORT = RMX_PORT + parseInt(`${Math.random() * 100}`)
const options: SpawnOptions = {
  ...SPAWN_OPTIONS,
  // stdio: 'inherit',
  cwd: EXAMPLE_MAGIX
}
describe(`${pkg.name} ${EXAMPLE_MAGIX}`, () => {
  after((done) => {
    done()
  })

  it('$ mm dev', function (done) {
    this.timeout(60 * 1000)
    const args = [
      `--port ${TEST_PORT}`
    ].join(' ').split(' ')
    const subprocess = spawn('mm', ['dev', ...args], options)
    validSubProcess(subprocess, options, () => {})
    const fetchOptions = { headers: { accept: 'html' } }
    setTimeout(() => {
      fetch(`http://127.0.0.1:${TEST_PORT}`, fetchOptions)
        .then(() => {
          done()
        })
    }, 1000 * 10)
  })
  it('$ mm build', function (done) {
    this.timeout(2 * 60 * 1000)
    const args = [].join(' ').split(' ')
    const subprocess = spawn('mm', ['build', ...args], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
  it('$ mm models', function (done) {
    this.timeout(5 * 1000)
    const args = [].join(' ').split(' ')
    const subprocess = spawn('mm', ['models', ...args], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
  it('$ mm spmlog', function (done) {
    this.timeout(5 * 1000)
    const args = [].join(' ').split(' ')
    const subprocess = spawn('mm', ['spmlog', ...args], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
  it('$ mm iconfont', function (done) {
    this.timeout(5 * 1000)
    const args = [].join(' ').split(' ')
    const subprocess = spawn('mm', ['iconfont', ...args], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
  it('$ mm chartpark', function (done) {
    this.timeout(5 * 1000)
    const args = [].join(' ').split(' ')
    const subprocess = spawn('mm', ['chartpark', ...args], options)
    validSubProcess(subprocess, options, () => {
      done()
    })
  })
})
