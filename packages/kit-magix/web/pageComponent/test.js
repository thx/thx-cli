/**
* Copyright(c) Alibaba Group Holding Limited.
*
* Authors:
*    昕雅 <yajun.wyj>
*/
import React from 'react'
import { Button } from '@alifd/next'

// Test 模块
class WebTestCommand extends React.Component {
  handleCommand = () => {
    // test 代表 任务id
    // socketTest 注册socket时的事件名称
    // 传输数据
    this.props.emit('test', 'socketTest', { foo: 'hello' })
  }

  render () {
    // 0 代表停止
    // 1 代表运行
    const { status, emit } = this.props
    console.log('porps', this.props)
    return (
      <div>
        <Button onClick={() => { this.handleCommand() }}>Test</Button>
        { status }
      </div>
    )
  }
}

export default WebTestCommand
