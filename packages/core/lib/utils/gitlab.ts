import { getConfig } from './mm'
import * as gitlabUtil from '../platforms/gitlab'
import { IGitLabGroup } from '../../types'

/**
 * 获取用户在 GitLab 上的分组信息
 */
export async function getGitlabGroups () {
  console.trace('不推荐继续使用 `getGitlabGroups()`，请改用 `getGitLabGroupList()`')
  const privateToken = getConfig('user.private_token')
  const groups = await gitlabUtil._getGroups(privateToken)
  return groups
}

/**
 * 获取用户在 GitLab 上的分组信息
 */
export async function getGitLabGroupList (): Promise<Array<IGitLabGroup>> {
  const privateToken = getConfig('user.private_token')
  const groups = await gitlabUtil.getGroupList(privateToken)
  return groups
}
