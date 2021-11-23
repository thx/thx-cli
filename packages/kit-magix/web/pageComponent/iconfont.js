'use strict'
import React from 'react'
import { Button, Input } from '@alifd/next'
import { get, post } from '../utils/api'
const curdir = window.RMX.project.dir

class Iconfont extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      canClick: false,
      errorTip: ''
    }
  }
  componentDidMount () {
    get('/extra/magix/config', {
      cwd: curdir
    }).then(res => {
      if (res) {
        let errorTip = ''
        if (!res.iconfontId) {
          errorTip = '还未配置iconfontId'
        } else if (!res.iconfontPath) {
          errorTip = '还未配置iconfontPath'
        }
        this.setState({
          canClick: res.iconfontId && res.iconfontPath,
          errorTip: errorTip
        })
      }
    })
  }
  exec () {
    this.props.emit('iconfont', 'magixIconfont', {
      cwd: curdir
    })
  }
  check () {
    this.props.emit('iconfont', 'magixCheckIconfont', {
      cwd: curdir
    })
  }
  render () {
    // 0 代表停止
    // 1 代表运行
    const {
      status
    } = this.props
    const {
      canClick,
      errorTip
    } = this.state
    if (status == 1) {
      this.hasCheckOk = true
    }
    return <div className='task-detail'>
      <div className='action-head'>同步iconfont上的图标到项目中</div>
      <div className='action-btn'>
        <Button className='_mr10' disabled={!canClick || (status == 1)} onClick={() => this.check()} >检测</Button>
        <Button disabled={!canClick || status == 1 || !this.hasCheckOk} onClick={() => this.exec()} >开始同步</Button>
        <span className='action-error'>{errorTip}</span>
      </div>
    </div>
  }
}

export default Iconfont
