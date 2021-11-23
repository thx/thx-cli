/**
* Copyright(c) Alibaba Group Holding Limited.
*
* Authors:
*    昕雅 <yajun.wyj>
*/
import React from 'react'
import { Button, Dialog, Table } from '@alifd/next'
import { get, post } from '../utils/api'
const curdir = window.RMX.project.dir

class Models extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      models: [],
      repeatApis: [],
      originModels: [],
      noMatchAPis: [],
      canClick: false,
      errorTip: ''
    }
  }
  componentDidMount () {
    get('/extra/magix/config', {
      cwd: curdir
    }).then(res => {
      if (res && res.rapProjectId) {
        this.checkModels()
      } else {
        this.setState({
          errorTip: '还未配置rapProjectId'
        })
      }
    })
  }

  checkModels () {
    post('/extra/magix/check/models', {
      cwd: curdir
    }).then(res => {
      if (res && res.data) {
        const canClick = res.data.noMatchAPis && res.data.noMatchAPis.length > 0
        this.setState({
          models: res.data.models || [],
          repeatApis: res.data.repeatApis || [],
          originModels: res.data.originModels || [],
          noMatchAPis: res.data.noMatchAPis || [],
          canClick: true,
          errorTip: canClick ? '' : '本地跟RAP上的接口一致，无需同步'
        })
      }
    })
  }
  exec () {
    const {
      models,
      repeatApis,
      originModels
    } = this.state
    this.props.emit('models', 'magixModels', {
      cwd: curdir,
      models,
      repeatApis,
      originModels
    })
  }

  handleCommand = () => {
    const {
      noMatchAPis
    } = this.state
    const me = this
    if (noMatchAPis.length > 0) {
      const dailog = Dialog.confirm({
        title: '提醒',
        content: 'RAP上有接口被删除或修改，确定要同步',
        onOk: () => {
          dailog.hide()
          me.exec()
          me.setState({
            noMatchAPis: []
          })
        },
        onCancel: () => {
          dailog.hide()
        }
      })
    } else {
      me.exec()
    }
  }
  showNoMatch () {
    const {
      noMatchAPis
    } = this.state
    const dialog = Dialog.show({
      title: 'RAP上被删除或修改过的接口',
      content: <Table dataSource={noMatchAPis} style={{ width: 600 }}>
        <Table.Column title='api名称' dataIndex='name' />
        <Table.Column title='方法名' dataIndex='method' />
        <Table.Column title='接口地址' dataIndex='url' />
      </Table>,
      footer: <Button onClick={() => { dialog.hide() }}>确定</Button>
    })
  }
  render () {
    // 0 代表停止
    // 1 代表运行
    const {
      status
    } = this.props
    const {
      noMatchAPis,
      canClick,
      errorTip
    } = this.state
    return (
      <div className='task-detail'>
        {noMatchAPis.length > 0
          ? <div className='warning-list'>
            <div className='warning-link' onClick={() => { this.showNoMatch() }}>点击查看RAP上被删除或修改过的接口</div>
          </div>
          : null
        }
        <div className='action-head'>同步RAP上的接口配置到项目中</div>
        <div className='action-btn'>
          <Button disabled={!canClick || (status == 1)} onClick={() => this.handleCommand()} >开始同步</Button>
          {/* <span className="action-error">{errorTip}</span> */}
        </div>

      </div>
    )
  }
}

export default Models
