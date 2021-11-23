export default function (models) {
  return `
/**
 * @chongzhi @mozhi
 * 来自rap的项目所有接口集合，该文件由 mm models 命令自动生成，请勿手动更改！
 * 新增接口请在rap上添加，然后执行 mm models 会自动更新本文件
 */

module.exports = [
${models.sort((a, b) => {
    return a.__id__ - b.__id__
  }).map(model => `
  // ${model.__apiName__} - ${model.__projectId__}#${model.__id__}
  {
    "name": "${model.name}",
    "method": "${model.method}",
    "url": "${model.url}"
  }`
  )}
]
`
}
