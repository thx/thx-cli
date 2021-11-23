/**
 * mm dev时注入到页面上的magix-desiger
 */
import * as requestPromise from 'request-promise' // MO TODO => node-fetch

export default ({
  mdPort = 3007,
  aiPort
}) => {
  return function * combine (next) {
    yield next

    let body = this.body.toString()
    if (body === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    // magix-desiger相关的js注入，保存在alp上面
    const magixDesigerJs = yield requestPromise({
      url: 'https://mo.m.taobao.com/magix_desiger_page_version',
      rejectUnauthorized: false
    })

    // 
    body = body.replace('</body>', `
        <!-- <magix-designer-port>${mdPort}</magix-designer-port> -->  
        <!-- <ai4md-cli-port>${aiPort}</ai4md-cli-port> -->
        <script src="${magixDesigerJs}"></script>
        </body>
    `)
    this.body = body
  }
}
