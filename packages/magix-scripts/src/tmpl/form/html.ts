export default function (name, action, path, viewPathAbs) {
  // 没有rap接口，直接返回静态模板
  if (!action) {
    action = {
      name: '标题',
      requestParameterList: [{
        name: '姓名',
        identifier: 'name'
      }, {
        name: '年龄',
        identifier: 'age'
      }, {
        name: '性别',
        identifier: 'gender'
      }]
    }
  }

  const params = action.requestParameterList

  return `
<div class="main-wrap" mx-spmc >
  <h3 class="mb20">${action.name}</h3>
  <div class="form">
  ${params.map(function (param) {
          return `
    <div class="form-field">
      <label class="lb">${param.name}：</label>

      <input type="text" value="{{:${param.identifier}}}" class="input">
    </div>
          `
      }).join('')}

    <div class="form-field">
        <a href="javascript:;" mx-click="submit()" class="btn btn-brand">提交</a>
    </div>
  </div>
</div>

`
}
