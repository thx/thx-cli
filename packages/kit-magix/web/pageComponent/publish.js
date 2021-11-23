'use strict'
import React from 'react'
import { Button, Input, Switch } from '@alifd/next'
import { get, post } from '../utils/api'
import Toast from '../component/toast/toast'
const curProject = window.RMX.project

class Publish extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSpm: true,
      commitMsg: '',
      international: false
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
      commitMsg,
      international
    } = this.state
    if (!commitMsg) {
      Toast.show('请先填写提交信息', 'warning')
      return
    }
    this.props.emit('publish', 'magixPublish', {
      cwd: curProject.dir,
      branch: curProject.branch,
      message: commitMsg,
      international: international,
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
      commitMsg,
      international
    } = this.state
    return <div className='task-detail'>
      <div className='action-head'>开启之前，请填写publish配置项</div>
      <div className='task-config'>
        <span className='task-config-label'>发布前执行spm打点</span>
        <Switch className='task-config-value' checked={isSpm} onChange={val => this.changeValue('isSpm', val)} />
        <br />
        <span className='task-config-label'>同时发布到国际版cdn</span>
        <Switch className='task-config-value' checked={international} onChange={val => this.changeValue('international', val)} />
        <br />
        <span className='task-config-textarea-label'>提交代码的commit信息</span>
        <Input.TextArea placeholder='请输入commit信息' style={{ width: '600px' }} value={commitMsg} onChange={val => this.changeValue('commitMsg', val)} />
      </div>
      <div className='action-btn'>
        <Button disabled={status == 1} onClick={() => this.exec()} >发布</Button>
      </div>
    </div>
  }
}

export default Publish
