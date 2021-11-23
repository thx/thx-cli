'use strict'
import React from 'react'
import { Button, Input, Switch } from '@alifd/next'
import { get, post } from '../utils/api'
import Toast from '../component/toast/toast'
const curProject = window.RMX.project

class Daily extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSpm: true,
      commitMsg: ''
    }
  }
  changeValue (key, val) {
    this.setState({
      [key]: val
    })
  }

  exec () {
    const {
      isSpm,
      commitMsg
    } = this.state
    if (!commitMsg) {
      Toast.show('请先填写提交信息', 'warning')
      return
    }
    this.props.emit('daily', 'magixDaily', {
      cwd: curProject.dir,
      branch: curProject.branch,
      message: commitMsg,
      nospm: !isSpm,
      uncheck: true
    })
  }
  render () {
    // 0 代表停止
    // 1 代表运行
    const {
      status
    } = this.props
    const {
      isSpm,
      commitMsg
    } = this.state
    return <div className='task-detail'>
      <div className='action-head'>开启之前，请填写daily配置项</div>
      <div className='task-config'>
        <span className='task-config-label'>执行打点任务</span>
        <Switch className='task-config-value' checked={isSpm} onChange={val => this.changeValue('isSpm', val)} />
        <br />
        <span className='task-config-textarea-label'>commit信息</span>
        <Input.TextArea placeholder='请输入commit信息' style={{ width: '600px' }} value={commitMsg} onChange={val => this.changeValue('commitMsg', val)} />
      </div>
      <div className='action-btn'>
        <Button disabled={status == 1} onClick={() => this.exec()} >发布到daily</Button>
      </div>
    </div>
  }
}

export default Daily
