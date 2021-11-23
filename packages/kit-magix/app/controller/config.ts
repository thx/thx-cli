import galleryApi from '../service/apis/gallery'
/**
 * 获取config信息
 */
export async function getConfig (ctx) {
  const { cwd } = ctx.request.query
  // console.log('utils', utils)
  const config = require(cwd + '/package.json')
  ctx.body = {
    success: true,
    data: (config && config.magixCliConfig) || {}
  }
}

/**
 * 获取本地组件列表
 */
export async function getGalleryList (ctx) {
  const { cwd } = ctx.request.query
  const data = await galleryApi.list({ cwd })
  ctx.body = {
    success: true,
    data: data || []
  }
}
