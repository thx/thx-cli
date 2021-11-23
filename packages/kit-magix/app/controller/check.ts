import modelsApi from '../service/apis/models'
import galleryApi from '../service/apis/gallery'

function galleryCheck (params) {
  return new Promise((resolve, reject) => {
    galleryApi.check(params).on('close', res => {
      if (res.error) {
        reject(res.error)
      } else {
        resolve(res.data)
      }
    })
  })
}
/**
 * 获取models信息
 */
async function checkModels (ctx) {
  const {
    cwd
  } = ctx.request.body
  const data = await modelsApi.check({ cwd })
  console.log(data)
  ctx.body = {
    success: true,
    data
  }
}

/**
 * check garrey信息
 */
async function checkGallery (ctx) {
  const {
    cwd,
    name
  } = ctx.request.body
  const data = await galleryCheck({ cwd, name })
  ctx.body = {
    success: true,
    data
  }
}

const actions = {
  checkModels,
  checkGallery
}

export default actions
