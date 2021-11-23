import { join } from 'path'
import { existsSync } from 'fs-extra'
import { describe, after, it } from 'mocha'
import { expect } from 'chai'
import { initMMHome } from '../lib/utils/mm'
import { MM_KIT_FOLDER, MM_HOME, MM_PLUGIN_FOLDER, MM_CONFIG_JSON } from '../lib/utils/constant'
const pkg = require('../package.json')

describe(pkg.name, () => {
  after((done) => {
    done()
  })
  it('MM_HOME', done => {
    initMMHome()
    expect(existsSync(MM_HOME))
      .to.be.equal(true)
    expect(existsSync(join(MM_HOME, MM_KIT_FOLDER)))
      .to.be.equal(true)
    expect(existsSync(join(MM_HOME, MM_PLUGIN_FOLDER)))
      .to.be.equal(true)
    expect(existsSync(join(MM_HOME, MM_CONFIG_JSON)))
      .to.be.equal(true)
    done()
  })
})
