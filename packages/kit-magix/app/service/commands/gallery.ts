'use strict'
/**
 * 将node_modules下的magix-gallery同步到本地项目中gallery下
 *  - mm gallery: 默认同步所有组件到本地项目中，如果有本地组件被修改过，给出提示，来决定是否覆盖升级
 *  - mm gallery -n <galleryName>: 指定同步某个组件，如果本地有组件有修改过，给出提示
 *  - mm gallery -l: 列出本地所有组件以及组件版本号
 */

import { gallery } from 'thx-magix-scripts'

export default async options => {
  options.pkgManager = 'npm'
  await gallery(options)
}
