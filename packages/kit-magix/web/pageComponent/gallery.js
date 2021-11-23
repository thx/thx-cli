'use strict'
import React from 'react'
import { Button, Select, Dialog, Table, Input, Loading } from '@alifd/next'
import { get, post } from '../utils/api'
import Toast from '../component/toast/toast'
const curdir = window.RMX.project.dir

class Gallery extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      list: [],
      canClick: false,
      loading: false
    }
  }
  componentDidMount () {
    get('/extra/magix/list/gallery', {
      cwd: curdir
    }).then(res => {
      if (res && res.length > 0) {
        const list = []
        for (let i = 0; i < res.length; i++) {
          if (res[i].list && res[i].list.length > 0) {
            for (let j = 0; j < res[i].list.length; j++) {
              list.push({
                repoName: res[i].repoName,
                path: res[i].path,
                label: res[i].repoName + ': ' + res[i].list[j].name,
                name: res[i].list[j].name,
                value: res[i].list[j].name,
                version: res[i].list[j].version
              })
            }
          }
        }
        this.setState({
          list: list
        })
      }
    })
  }
  changeValue (key, val) {
    this.setState({
      [key]: val
    })
  }
  exec () {
    const {
      name
    } = this.state
    this.props.emit('gallery', 'magixGallery', {
      cwd: curdir,
      name
    })
  }
  check () {
    const {
      name
    } = this.state
    this.setState({
      loading: true
    })
    // this.props.emit('gallery', 'magixCheckGallery', {
    //   cwd: curdir,
    //   name
    // })

    post('/extra/magix/check/gallery', {
      cwd: curdir,
      name
    }).then(res => {
      this.setState({
        loading: false
      })
      if (res && res.length > 0) {
        const list = []
        for (let i = 0; i < res.length; i++) {
          if (res[i].modifyFiles && res[i].modifyFiles.length > 0) {
            for (let j = 0; j < res[i].modifyFiles.length; j++) {
              list.push({
                galleryName: res[i].galleryName,
                name: res[i].modifyFiles[j].filePath,
                status: res[i].modifyFiles[j].type
              })
            }
          }
        }
        this.showDiffGallery(list)
      }else {
        this.exec()
      }
    })
  }

  showDiffGallery (data) {
    const me = this
    const dialog = Dialog.show({
      title: '更新过的组件',
      content: <Table dataSource={data} style={{ width: 600 }}>
        <Table.Column title='组件名' dataIndex='galleryName' />
        <Table.Column title='路径' dataIndex='name' />
        <Table.Column title='状态' dataIndex='status' />
      </Table>,
      footer: <div>
        <Button type='primary' className='_mr10' onClick={() => {
          dialog.hide()
          me.exec()
        }}>确定</Button>
        <Button onClick={() => { dialog.hide() }}>取消</Button>
      </div>
    })
  }

  showList () {
    const {
      list
    } = this.state
    const dialog = Dialog.show({
      title: '本地所有组件列表',
      content: <Table dataSource={list} style={{ width: 600 }}>
        <Table.Column title='组件名' dataIndex='name' />
        <Table.Column title='版本' dataIndex='version' />
        <Table.Column title='组件库名' dataIndex='repoName' />
        <Table.Column title='安装路径' dataIndex='path' />
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
      name,
      list,
      loading
    } = this.state
    return <div className='task-detail'>
      <Loading visible={loading} fullScreen shape='fusion-reactor'>
        {list.length > 0
        ? <div className='warning-list'>
            <div className='warning-link' onClick={() => { this.showList() }}>点击查看本地所有组件列表</div>
          </div>
          : null
        }
        <div className='action-head'>同步gallery组件到项目中</div>
        <div className='task-config'>
          <span className='task-config-label'>组件</span>
          {/* <Select className="task-config-value" dataSource={list} style={{width: '400px'}} value={name} onChange={val => this.changeValue('name', val)} /> */}

          <Input className='task-config-value' style={{ width: '200px' }} value={name} onChange={val => this.changeValue('name', val)} />
          <span className='task-config-tips'>如果不填则是全量同步</span>
        </div>
        <div className='action-btn'>
          <Button className='_mr10' onClick={() => this.check()} >执行</Button>
          {/* <Button disabled={status==1||!this.hasCheck} onClick={ ()=>this.exec() } >开始同步</Button> */}
        </div>
    </Loading>
    </div>
  }
}

export default Gallery
