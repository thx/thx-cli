'use strict'
import React from 'react'
import { Button } from '@alifd/next'
import { get } from '../utils/api'
const curdir = window.RMX.project.dir

class Spmlog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      removeSpm: false,
      canClick: false,
      errorTip: ''
    }
  }

  componentDidMount () {
    get('/extra/magix/config', {
      cwd: curdir
    }).then(res => {
      if (res) {
        this.setState({
          canClick: !!res.spma,
          errorTip: res.spma ? '' : '还未配置spma'
        })
      }
    })
  }
  changeValue (key, val) {
    this.setState({
      [key]: val
    })
  }
  exec (removeSpm) {
    this.props.emit('spmlog', 'magixSpmlog', {
      cwd: curdir,
      removeSpm: removeSpm
    })
  }
  render () {
    // 0 代表停止
    // 1 代表运行
    const {
      status
    } = this.props
    const {
      removeSpm,
      canClick,
      errorTip
    } = this.state
    return <div className='task-detail'>
      <div className='action-head'>追加spm打点，同时同步数据小站数据配置</div>
      {/* <div className="task-config">
          <span className="task-config-label">清除打点</span>
          <Switch className="task-config-value" checked={removeSpm} onChange={val => this.changeValue('removeSpm', val)} />
        </div> */}
      <div className='action-btn'>
        <Button className='_mr10' disabled={!canClick || (status == 1)} onClick={() => this.exec(false)} >打点</Button>
        <Button disabled={!canClick || (status == 1)} onClick={() => this.exec(true)} >清空打点</Button>
        <span className='action-error'>{errorTip}</span>
      </div>
    </div>
  }
}

export default Spmlog
