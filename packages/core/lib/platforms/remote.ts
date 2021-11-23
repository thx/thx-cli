import { CommanderStatic } from 'commander'
import { blueBright } from 'chalk'
import { getAppPath, getAppRC, getLength, prefixLength } from '../utils'
import logger from '../logger'

export const remoteRap = (rapProjectId: string | number) => {
  if (rapProjectId) return `https://rap2.alibaba-inc.com/repository/editor?id=${rapProjectId}`
}
export const remoteIconfont = (iconfontId: string | number) => {
  if (iconfontId) return `https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=${iconfontId}`
}
export const remoteDef = (defId: string | number) => {
  if (defId) return `https://work.def.alibaba-inc.com/app/${defId}/index`
}
export const remoteChartPark = (chartParkId: string | number) => {
  if (chartParkId) return `https://chartpark.alibaba-inc.com/#!/manage/index?projectId=${chartParkId}`
}
export const remoteAPlus = (spma: string) => {
  if (spma) return `https://aplus.alibaba-inc.com/aplus/page.htm?pageId=17164&id=${spma}`
}
export const remoteDataPlus = (spma: string) => {
  if (spma) return `https://data.alimama.net/#!/performance/index?spma=${spma}`
}

export default async function remote (command: CommanderStatic) {
  const appPath = await getAppPath()
  const appRC = await getAppRC(appPath)
  const { gitlabUrl, rapProjectId, defId, iconfontId, chartParkId, spma } = appRC

  const platforms = []
  if (gitlabUrl) platforms.push({ title: 'GitLab 仓库', repository: gitlabUrl })
  if (rapProjectId) platforms.push({ title: 'RAP2 仓库', repository: remoteRap(rapProjectId) })
  if (defId) platforms.push({ title: 'DEF 研发平台', repository: remoteDef(defId) })
  if (iconfontId) platforms.push({ title: 'Iconfont 仓库', repository: remoteIconfont(iconfontId) })
  if (chartParkId) platforms.push({ title: 'ChartPark 项目', repository: remoteChartPark(chartParkId) })
  if (spma) {
    platforms.push({ title: 'APlus', repository: remoteAPlus(spma) })
    platforms.push({ title: '数据小站 DataPlus', repository: remoteDataPlus(spma) })
  }

  logger.debug(platforms)

  // --json
  if (command.json) {
    console.log(JSON.stringify(platforms, null, 2))
    return
  }

  // 打印
  console.log('')
  const maxLength = Math.max(...platforms.map(item => getLength(item.title)), 10)
  platforms.forEach(item =>
    console.log('  ', prefixLength(item.title, maxLength), '🔗', blueBright.bold(item.repository))
  )
  console.log('')
}
