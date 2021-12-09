export default function (name, action, path, viewPathAbs) {
  if (!action) {
    action = {
      name: '标题',
      requestParameterList: [{
        identifier: 'status',
        name: '状态'
      }, {
        identifier: 'type',
        name: '类型'
      }],
      responseParameterList: [{
        identifier: 'data',
        parameterList: [{
          identifier: 'list',
          parameterList: [{
            identifier: 'name',
            name: '名称'
          }, {
            identifier: 'creatTime',
            name: '创建时间'
          }, {
            identifier: 'status',
            name: '状态'
          }, {
            identifier: 'detail',
            name: '详细内容'
          }]
        }]
      }]
    }
  }

  const params = action.requestParameterList // 请求参数
  let responseParams = [] // 返回值，格式：data.list

  action.responseParameterList.forEach(function (item, i) {
    if (item.identifier.indexOf('data') > -1) {
      item.parameterList.forEach(function (_item, _i) {
        if (_item.identifier.indexOf('list') > -1) {
          responseParams = _item.parameterList
        }
      })
    }
  })

  const options = []
  for (let i = 0; i < 3; i++) {
    options.push({
      name: '选项' + i,
      value: i
    })
  }

  return `
    <div class="grid" mx-spmc >
        <div class="dialog-header">
          <strong class="fontsize-16">${action.name}</strong>
        </div>

        <div class="dialog-body">
          <div class="mb20">
              <mx-calendar.datepicker class="w200 mr15" 
              min="{{=min}}"
              max="{{=max}}"
              align="right"
              prefix="截止至"
              selected="{{:selected}}"
              />
          
          ${params.map(function (param) {
              return `

              <mx-dropdown 
              class="mr15"
              selected="{{:selected{refresh:true}}}"
              list="{{@[{
                  text: '选项1',
                  value: 1
              }, {
                  text: '选项2',
                  value: 2
              }]}}" />

          `
          }).join('')}

            <div class="w160 ib mr15">
              <div class="search-box ">
                <i class="mc-iconfont search-icon">&#xe651;</i>
                <input class="input search-input" placeholder="输入关键词回车搜索" value="{{:params.userName}}" mx-keyup="submit()" >
              </div>
            </div>
                
          </div>
        
          <table class="table">
            <thead>
                <tr>
                    ${responseParams.map(function (param) {
                return `<th>${param.name || '-表头-'}</th>
                        `
            }).join('')}
                </tr>
            </thead>
            <tbody>
                {{each list as item index}}
                <tr>
                    ${responseParams.map(function (param) {
                return `<td>{{=item.${param.identifier.split('|')[0]}}}</td>
                        `
            }).join('')}
                </tr>
                {{/each}}
            
                {{if list.length === 0}}
                    <tr><td colspan="${responseParams.length}" class="tc">暂无结果</td></tr>
                {{/if}}
            </tbody>
            <tfoot>
                <tr>
                <td colspan="6">
                    <mx-pagination
                    total="{{@total}}" 
                    sizes="{{@[20,40,50]}}"
                    size="{{@params.pageSize}}" 
                    page="{{@params.page}}"
                    mx-change="change()">
                </mx-pagination>
                                
                </td>
                </tr>
            </tfoot>
          </table>
        </div>
    </div>
    
`
}
