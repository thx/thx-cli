'use strict'
import React from 'react'
import { Button } from '@alifd/next'
import { get } from '../utils/api'
const curdir = window.RMX.project.dir

class ChartPark extends React.Component {
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
        this.setState({
          canClick: !!res.chartParkId,
          errorTip: res.chartParkId ? '' : '还未配置chartParkId'
        })
      }
    })
  }

  exec () {
    this.props.emit('chartpark', 'magixChartpark', {
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
    return <div className='task-detail'>
      <div className='action-head'>同步chartpark上的数据到项目中</div>
      <div className='action-btn'>
        <Button disabled={!canClick || (status == 1)} onClick={() => this.exec()} >开始同步</Button>
        <span className='action-error'>{errorTip}</span>
      </div>
    </div>
  }
}

export default ChartPark
