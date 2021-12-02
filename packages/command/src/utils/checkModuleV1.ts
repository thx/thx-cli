import { IKitInfo, IPluginInfo } from 'thx-cli-core/types'

export function convertToNextInfo (info: any) : IKitInfo | IPluginInfo {
  const { name, title, value, package: packageName, ...extra } = info
  return {
    porotocal: '1.x',
    name,
    title: title || name,
    package: packageName || value,
    ...extra
  }
}
