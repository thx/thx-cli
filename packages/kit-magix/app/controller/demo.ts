/**
 * 获取信息
 */
export async function get (ctx) {
  ctx.body = {
    success: true,
    data: {
      message: 'demo套件的get请求返回',
      params: ctx.request.query
    }
  }
}

/**
 * post信息
 */
export async function post (ctx) {
  ctx.body = {
    success: true,
    data: {
      message: 'demo套件的post请求返回',
      params: ctx.request.body
    }
  }
}
