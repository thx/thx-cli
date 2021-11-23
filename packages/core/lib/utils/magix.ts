import { getPkgInfo } from './tnpm'

// 兼容老的galleries配置为{}key-value形式，转在[{}]对象数组形式，并兼容更早之前只配置galleryPath时的情形
export function compatGalleriesConfig (rmxConfig: any = {}) {
  let galleriesConfig = rmxConfig.galleries || []
  let magixGalleryExist = false

  // 兼容老的galleries配置
  if (Object.prototype.toString.call(galleriesConfig) === '[object Object]') {
    const _galleriesConfig = []
    for (const k in galleriesConfig) {
      _galleriesConfig.push({
        name: k,
        path: galleriesConfig[k]
      })
    }
    galleriesConfig = _galleriesConfig
  }

  for (const gallery of galleriesConfig) {
    const gName = getPkgInfo(gallery.name).name // 组件库名
    if (gName === 'magix-gallery') {
      magixGalleryExist = true
    }
  }

  if (rmxConfig.galleryPath && !magixGalleryExist) {
    // magix-gallery默认安装最新版
    galleriesConfig = [{
      name: 'magix-gallery',
      path: rmxConfig.galleryPath
    }]
  }

  return galleriesConfig
}
