import * as fs from 'fs'
import * as path from 'path'
import * as ini from 'ini'
import { execCommandReturn, execCommand, spawnCommand, execCommandSync, spawn } from './process'
import { blueBright, yellowBright } from 'chalk'
import { prompt } from 'inquirer'
import * as moment from 'moment'

/**
   * 获取git信息
   *
   * @return {String}
   */
export function getGitConfig (dir) {
  console.trace('不推荐继续使用 `getGitConfig(dir)`，请改用 `getGitInfo(appPath)`')
  if (hasGit(dir)) {
    try {
      const gitConfig = fs.readFileSync(path.join(dir, '.git/config'), 'utf-8').trim()
      const config = ini.parse(gitConfig)
      if (config) {
        const url = config['remote "origin"'].url
        const repo = url.replace('git@gitlab.alibaba-inc.com:', '').replace('.git', '')
        const branch = getCurGitBranch(dir)
        return {
          url: url,
          repo: repo,
          branch: branch
        }
      }
    } catch (e) {
      return null
    }
  }
  return null
}

export function getGitInfo (appPath: string) {
  if (hasGit(appPath)) {
    try {
      const gitConfig = fs.readFileSync(path.join(appPath, '.git/config'), 'utf-8').trim()
      const config = ini.parse(gitConfig)
      if (config) {
        const url = config['remote "origin"'].url
        const temp = url.replace('git@gitlab.alibaba-inc.com:', '').replace('.git', '')
        const [group, name] = temp.split('/')
        const branch = getCurGitBranch(appPath)
        const branchVersion = branch.split('/')[1]
        return {
          type: 'git',
          url: url,
          group,
          name,
          branch,
          branchVersion
        }
      }
    } catch (e) {
      return null
    }
  }
  return null
}

/**
   * 获取当前分支
   *
   * @return {String}
   */
export function getCurGitBranch (dir) {
  try {
    const gitHEAD = fs.readFileSync(path.join(dir, '.git/HEAD'), 'utf-8').trim() // ref: refs/heads/daily/0.0.1
    if (gitHEAD) {
      let ref = gitHEAD.split(':')[1]
      ref = ref.replace(' ', '')
      return ref.replace('refs/heads/', '')
    }
  } catch (e) {
    return ''
  }
  return ''
}
/**
   * 是否有git
   *
   * @return {String}
   */
export function hasGit (dir) {
  return fs.existsSync(path.join(dir, '.git'))
}

// 获取当前分支名
export async function getPrecentBranch (cwd?) {
  cwd = cwd || process.cwd()
  const branchs: any = await execCommandReturn('git branch', { cwd }) // MO FIXED _cwd 是什么参数，拼写错误 _cwd => cwd
  if (!branchs) {
    return
  }
  const current = /.*\*\s([\S]+)\s*/.exec(branchs)[1] // 拿到当前分支名
  return current
}

/**
 * 判断是否在 master 分支下
 * @param cwd
 */
export function isMaster (cwd?) {
  return new Promise(async (resolve) => {
    const currentBranch = await getPrecentBranch(cwd)
    resolve(currentBranch === 'master')
  })
}

// 以下代码迁移自 @ali/alimama-deploy

const commitMsg = 'auto commit by mm-cli'

// 判断 master 是否有更新
export async function isMasterUpdate (currentBranch, verify, message = commitMsg, cwd, log) {
  // 提交当前分支
  log(`${blueBright('ⓘ [MM CLI]')} [${moment().format('HH:mm:ss')}] 开始提交当前分支`)
  await execCommand('git status', { cwd })
  await execCommand('git add -A', { cwd })
  await execCommand(`git commit -m "${message}"${verify ? '' : ' --no-verify'}`, { cwd })

  // 更新当前分支
  await spawnCommand('git', ['pull', 'origin', currentBranch], { cwd })
  execCommandSync(`git push origin ${currentBranch}`, { cwd })

  const updateMsg = await execCommandReturn('git fetch origin master', { cwd })
  return updateMsg && updateMsg.includes('-> origin/master') // 如果 master 有更新，会包含 `-> origin/master` 字符
}

// 发布前先提交本地代码，并且合并master代码到当前分支
export async function mergeMaster (currentBranch, cwd, log) {
  return new Promise((resolve, reject) => {
    let confliced = false
    log(`${blueBright('ⓘ [MM CLI]')} [${moment().format('HH:mm:ss')}] 开始合并 master 分支到当前分支`)

    spawn('git', ['merge', 'fetch_head'], { cwd })
      .on('data', msg => {
        if (msg.includes('CONFLICT')) {
          confliced = true
        }
        log(`${msg}`)
      })
      .on('close', async resp => {
        if (confliced) {
          reject(new Error('❌ [MM CLI] 合并 master 分支有冲突，请先解决冲突，再重新发布'))
        } else if (resp.error) {
          reject(resp.error)
        } else {
          await execCommand('git push origin ' + currentBranch, { cwd })
          resolve(undefined)
        }
      })
  })
}

export async function checkMasterUpdate ({ cwd, branch, uncheck, message, verify, log = console.log }) {
  // 更新 master 代码
  const masterUpdate = await isMasterUpdate(branch, verify, message, cwd, log)

  // 如果 master 分支有更新，给出提示
  if (masterUpdate && !uncheck) {
    const questions = [{
      type: 'confirm',
      name: 'merge',
      message: `${blueBright('ⓘ [MM CLI]')} ${yellowBright('检测到 master 分支有更新，确定要继续发布吗？')}`
    }]
    const answers = await prompt(questions)
    if (!answers.merge) {
      process.exit(0)
    }
  }

  // 继续发布，merge master
  await mergeMaster(branch, cwd, log)
}
