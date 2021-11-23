'use strict'
import React from 'react'
import { Input, Form, Checkbox, Field } from '@alifd/next'
import { get, post } from '../utils/api'
import Toast from '../component/toast/toast'

class DevItem extends React.Component {
  render () {
    const { value } = this.props
    return <div>
      {
        value.map(({ name, host, ip }) => {
          return <div className='item-row'>
            <span>
              <span className='mr5'>名称:</span>
              <Input defaultValue={name} className='mb5' />
              <span className='mr5 ml5'>IP:</span>
              <Input placeholder='IP' className='mb5' defaultValue={ip} />
              <span className='mr5 ml5'>域名:</span>
              <Input placeholder='域名' className='mb5' defaultValue={host} />
            </span>
          </div>
        })
      }
    </div>
  }
}

class GalleryItem extends React.Component {
  render () {
    const { value } = this.props
    return <div>
      {
        value.map(({ name, path }) => {
          return <div className='item-row'>
            <span>
              <span className='mr5'>组件库名称:</span>
              <Input defaultValue={name} className='mb5' />
              <span className='mr5 ml5'>同步到路径:</span>
              <Input defaultValue={path} className='mb5' />
            </span>
          </div>
        })
      }
    </div>
  }
}

class InputItem extends React.Component {
  render () {
    const { value } = this.props
    return <div>
      {
        value.map((v) => {
          return <span className='item-short '>
            <Input className='width100' defaultValue={v} />
          </span>
        })
      }
    </div>
  }
}

// const curdir = window.RMX.project.dir
// const Tooltip = Balloon.Tooltip

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    fixedSpan: 6
  },
  wrapperCol: {
    span: 18
  }
}

class CliConfig extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      defaultForm: {
        matPort: {
          label: 'MatPort',
          name: 'matPort',
          value: 1234,
          type: 'input'
        },
        timeout: {
          label: '接口超时',
          name: 'timeout',
          value: 1000,
          type: 'input'
        },
        autoOpenUrl: {
          label: '自动打开域名',
          name: 'autoOpenUrl',
          value: 'localhost',
          type: 'input'
        },
        apiMatch: {
          label: '代理配置',
          name: 'apiMatch',
          value: [
            'api/',
            '.json',
            '.action'
          ],
          type: 'inputItem'
        },
        indexMatch: {
          label: '入口文件',
          name: 'indexMatch',
          value: [
            'index.html'
          ],
          type: 'inputItem'
        },
        scopedCss: {
          label: 'scoped样式',
          name: 'scopedCss',
          value: [
            './src/app/assets/iconfont.less'
          ],
          type: 'inputItem'
        },
        globalCss: {
          label: 'global全局样式',
          name: 'globalCss',
          value: [
            './src/app/gallery/mx-style/index.less'
          ],
          type: 'inputItem'
        },
        magixLoaderType: {
          label: '模块类型',
          name: 'magixLoaderType',
          value: 'cmd',
          type: 'input'
        },
        magixJsTranspile: {
          label: '目标语言',
          name: 'magixJsTranspile',
          value: 'ES3',
          type: 'input'
        },
        rootAppName: {
          label: 'app唯一标识',
          name: 'rootAppName',
          value: 'app',
          type: 'input'
        },
        HMRWatchFiles: {
          label: '监听文件',
          name: 'HMRWatchFiles',
          value: [
            'src/**/*.js',
            'src/**/*.ts',
            'src/**/*.es',
            'src/**/*.mx',
            'src/**/*.css',
            'src/**/*.html',
            'src/**/*.scss',
            'src/**/*.less'
          ],
          type: 'inputItem'
        },
        dynamicProjectName: {
          label: '包名是否动态',
          name: 'dynamicProjectName',
          value: true,
          type: 'checkbox'
        },
        jsExtension: {
          label: 'add生成格式',
          name: 'jsExtension',
          value: '.es',
          type: 'input'
        },
        dataLimit: {
          label: 'POST请求大小',
          name: 'dataLimit',
          value: '10mb',
          type: 'input'
        },
        rapVersion: {
          label: 'Rap版本',
          name: 'rapVersion',
          value: 2,
          type: 'input'
        },
        rapProjectId: {
          label: 'Rap版本',
          name: 'rapProjectId',
          value: 2,
          type: 'input',
          disabled: true
        },
        modelsPath: {
          label: 'models路径',
          name: 'modelsPath',
          value: 'src/app/services/models.js',
          type: 'input',
          disabled: true
        },
        modelsTmpl: {
          label: 'models模板',
          name: 'modelsTmpl',
          value: '',
          type: 'input',
          disabled: true
        },
        srcFolder: {
          label: '源文件目录',
          name: 'srcFolder',
          value: 'src',
          type: 'input'
        },
        buildFolder: {
          label: '编译目录',
          name: 'buildFolder',
          value: 'build',
          type: 'input'
        },
        cloudBuild: {
          label: '云构建',
          name: 'cloudBuild',
          value: true,
          type: 'checkbox'
        },
        logkey: {
          label: '黄金令箭',
          name: 'logkey',
          value: 'alimama_bp.3.1',
          type: 'input'
        },
        spma: {
          label: 'spm-a段',
          name: 'spma',
          value: 'a2e17',
          type: 'input',
          disabled: true
        },
        // logkey: {
        //   label: '黄金令箭',
        //   name: 'logkey',
        //   value: 'alimama_bp.3.1',
        //   type: 'input'
        // },
        dataPlusConfigPath: {
          label: '数据小站配置',
          name: 'dataPlusConfigPath',
          value: 'src/app/dataplus/config.js',
          type: 'input'
        },
        dataPlusConfigTmpl: {
          label: '数据小站模板',
          name: 'dataPlusConfigTmpl',
          value: '',
          type: 'input'
        },
        spmFolder: {
          label: 'spm打点目录',
          name: 'spmFolder',
          value: 'src/app/views',
          type: 'input'
        },
        spmPropertyMatch: {
          label: 'spm规则',
          name: 'spmPropertyMatch',
          value: [
            'to="',
            ':to="'
          ],
          type: 'inputItem'
        },
        chartParkId: {
          label: 'chartParkId',
          name: 'chartParkId',
          value: '',
          type: 'input'
        },
        chartParkIndexPath: {
          label: 'chartPark路径',
          name: 'chartParkIndexPath',
          value: 'src/app/chartpark/index.js',
          type: 'input'
        },
        chartParkIndexTmpl: {
          label: 'chartPark模板',
          name: 'chartParkIndexTmpl',
          value: '',
          type: 'input'
        },
        codeTmpl: {
          label: 'view代码片段',
          name: 'codeTmpl',
          value: '',
          type: 'input'
        },
        galleries: {
          label: '组件galler配置',
          name: 'galleries',
          value: [{
            name: '@ali/zs-gallery', // 组件库名称，可以@指定组件库版本
            path: 'src/app/gallery' // 组件同步到项目中的路径
          }],
          type: 'galleryItem'
        },
        galleriesMxRoot: {
          label: '通用组件路径',
          name: 'galleriesMxRoot',
          value: 'app/gallery',
          type: 'input'
        },
        galleriesLgRoot: {
          label: '组件路径',
          name: 'galleriesLgRoot',
          value: 'app/gallery-local',
          type: 'input'
        },
        defId: {
          label: 'defId',
          name: 'defId',
          value: '123',
          type: 'input',
          disabled: true
        },
        iconfontId: {
          label: 'iconfontId',
          name: 'iconfontId',
          value: '',
          type: 'input',
          disabled: true
        },
        iconfontScanPath: {
          label: 'iconfontScanPath',
          name: 'iconfontScanPath',
          value: 'src',
          type: 'input',
          disabled: true
        },
        iconfontPath: {
          label: 'iconfontPath',
          name: 'iconfontPath',
          value: 'src/app/assets/iconfont.less',
          type: 'input',
          disabled: true
        },
        rapper: {
          label: '启用rapper',
          name: 'rapper',
          value: true,
          type: 'checkbox',
          disabled: true
        },
        ipConfig: {
          label: '开发环境配置',
          name: 'ipConfig',
          value: [{
            name: '名称',
            ip: '127.0.0.1',
            host: 'magix.taobao.com'
          }],
          type: 'devItem'
        }
      }
    }
  }
  field = new Field(this, {
    deepReset: true
  })
  handleSubmit = (values) => {
    const customValues = this.field.getValues()
    const config = {}

    // "ipConfig": {
    //   "日常": "11.160.79.18",
    // } 格式装换
    customValues.ipConfig.forEach(({ name, host, ip }) => {
      config[name] = ip
    })

    customValues.ipConfig = config

    post('/rmx/config/save', {
      config: {
        ...values,
        ...customValues
      },
      cwd: window.RMX.project.dir
    }).then((res) => {
      Toast.show('保存成功')
    })
    console.log('values----', values, customValues)
  }
  componentDidMount () {
    const { defaultForm } = this.state
    const path = window.location.pathname.match(/^\/app\/(.*?)$/)[1]

    get(`/project/get`, { id: path }).then(res => {
      const { magixCliConfig } = res

      if (magixCliConfig.ipConfig) {
        const keys = Object.keys(magixCliConfig.ipConfig)

        const ipConfig = keys.map((name) => {
          return {
            name: name,
            ip: magixCliConfig.ipConfig[name],
            host: 'magix.taobao.com'
          }
        })

        magixCliConfig.ipConfig = ipConfig
        console.log('projects', magixCliConfig)
      }

      const overrideKeys = Object.keys(magixCliConfig)

      overrideKeys.forEach((key) => {
        let value = magixCliConfig[key]

        if (defaultForm[key]) {
          defaultForm[key].value = value
        }
      })

      this.setState({
        defaultForm,
        loaded: true
      })
      // let list = res.map((item) => {
      //   return {
      //     key:item.id,
      //     value:item.id
      //   }
      // })

      console.log('list', res)
    })
  }
  render () {
    const { init, setValue, reset } = this.field
    const { defaultForm, loaded = false } = this.state

    if (!loaded) return <div>loading</div>

    return (<div className='side-extra-page'>
      <h3>MagixCliConfig配置</h3>
      <Form style={{ width: '80%' }} {...formItemLayout} >
        {
          Object.keys(defaultForm).map((key) => {
            const { value, name, type, label, disabled = false } = defaultForm[key]
            let com = null

            switch (type) {
              case 'input':
                com = <FormItem label={label + ':'}>
                  <Input disabled={disabled} style={{ width: 210 }} name={name} defaultValue={value} />
                </FormItem>
                break
              case 'devItem':
                com = <FormItem label={label + ':'} >
                  <DevItem {...init(name, { initValue: value })} />
                </FormItem>
                break
              case 'inputItem':
                com = <FormItem label={label + ':'} >
                  <InputItem {...init(name, { initValue: value })} />
                </FormItem>
                break
              case 'checkbox':
                com = <FormItem label={label + ':'}>
                  <Checkbox name={name} defaultChecked={value} />
                </FormItem>
                break
              case 'galleryItem':
                com = <FormItem label={label + ':'} >
                  <GalleryItem {...init(name, { initValue: value })} />
                </FormItem>
                break
              default:
                break
            }

            return com
          })
        }

        <FormItem label=' '>
          <Form.Submit onClick={this.handleSubmit}>保存配置</Form.Submit>
        </FormItem>
      </Form>
    </div>)
  }
}

export default CliConfig
