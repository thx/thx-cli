/**
* Copyright(c) Alibaba Group Holding Limited.
*
* Authors:
*    昕雅 <yajun.wyj>
*/
import React from 'react'
import { Button, Input, Switch, Select, Balloon, Icon } from '@alifd/next'
import { get } from '../utils/api'
const Tooltip = Balloon.Tooltip
// const curdir = window.RMX.project.dir

class Dev extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appPath: window.RMX.project.dir,

      port: '',
      ip: '',
      isHmr: true,
      isHttps: false,
      isDebug: false,
      isDocs: true,
      isDesiger: true,
      ipList: []
    }
  }
  componentDidMount () {
    get('/extra/magix/config', {
      cwd: this.state.appPath
    }).then(res => {
      if (res) {
        const ipConfig = res.ipConfig || {}
        const ipList = []
        for (let key in ipConfig) {
          ipList.push({
            label: key,
            value: ipConfig[key]
          })
        }
        this.setState({
          port: res.matPort || '',
          ipList: ipList
        })
      }
    })
  }
  exec () {
    const {
      port,
      ip,
      isHmr,
      isHttps,
      isDebug,
      isDocs,
      isDesiger
    } = this.state
    this.props.emit('dev', 'magixDev', {
      cwd: this.state.appPath,
      port,
      ip,
      isCloseHmr: !isHmr,
      isHttps,
      isDebug,
      isCloseDocs: !isDocs,
      isCloseDesiger: !isDesiger
    })
  }

  stopExec () {
    this.props.emit('dev', 'magixDev', { cwd: this.state.appPath })
  }

  changeValue (key, val) {
    if (key === 'port' && !/^[0-9]*$/.test(val)) {
      return
    }
    this.setState({
      [key]: val
    })
  }
  render () {
    // 0 代表停止
    // 1 代表运行
    const {
      status
    } = this.props
    const {
      port,
      ip,
      isHmr,
      isHttps,
      isDebug,
      isDocs,
      isDesiger,
      ipList,
      log
    } = this.state

    return (
      <div className='task-detail'>
        <div className='action-head'>开启之前，请填写dev配置项</div>
        <div className='task-config'>
          <span className='task-config-label'>端口号</span>
          <Input className='task-config-value' value={port} onChange={val => this.changeValue('port', val)} />
          <span className='task-config-label'>ip地址 <Tooltip trigger={<Icon size='xs' type='help' />} align='t'>对接真实接口时的ip地址，格式为 "ip" 或者 "ip,域名" ，默认对接RAP时无此值</Tooltip></span>
          <Select className='task-config-value' style={{ width: '200px' }} value={ip} dataSource={ipList} onChange={val => this.changeValue('ip', val)} />
          <span className='task-config-tips'>ip为空时，表示走rap</span>
          <br />
          <span className='task-config-label'>HMR热更新</span>
          <Switch className='task-config-value' checked={isHmr} onChange={val => this.changeValue('isHmr', val)} />
          <span className='task-config-label'>反向代理https</span>
          <Switch className='task-config-value' checked={isHttps} onChange={val => this.changeValue('isHttps', val)} />
          <span className='task-config-label'>debug模式 <Tooltip trigger={<Icon size='xs' type='help' />} align='t'>开启debug模式会校验rap接口等</Tooltip></span>
          <Switch className='task-config-value' checked={isDebug} onChange={val => this.changeValue('isDebug', val)} />
          <span className='task-config-label'>帮助文档提示</span>
          <Switch className='task-config-value' checked={isDocs} onChange={val => this.changeValue('isDocs', val)} />
          <span className='task-config-label'>magix-desiger</span>
          <Switch className='task-config-value' checked={isDesiger} onChange={val => this.changeValue('isDesiger', val)} />
        </div>
        <div className='action-btn'>
          <Button disabled={status == 1} className='_mr10' onClick={() => this.exec()} >开启dev</Button>
          <Button disabled={status == 0} onClick={() => this.stopExec()} >结束dev</Button>
        </div>
      </div>
    )
  }
}

export default Dev
