import { describe, after, it } from 'mocha'
import { expect } from 'chai'

describe('MM CLI', () => {
  after(function (done) {
    done()
  })
  it('example', function (done) {
    expect({}).to.be.a('object')
    done()
  })
})
