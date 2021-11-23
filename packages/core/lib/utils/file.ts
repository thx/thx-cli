import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as path from 'path'
import * as mkdirp from 'mkdirp'
import { walk } from 'walk'
import logger from '../logger'
// import * as parseJson from 'parse-json' // FIXED 1.x 废弃 parse-json

/**
   * 读取 JSON 文件
   * @param  {String} file
   * @return {Mixed}
   *  - null: read json failed
   */
export function readJSON (file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'), file)
  } catch (err) {
    console.error(`读取失败 ${file}`)
    console.error(err)
    return null
  }
}
/**
   * 写入 json 文件
   * @param {String} file
   * @param {Object} object
   */
export function writeJSON (file, object) {
  fs.writeFileSync(file, JSON.stringify(object, null, 2) + '\n')
}

/**
   * 以安全的方式写入 JSON 数据
   * @param {String} file
   * @param {Object} data
   */
export function safeWriteJSON (file, data) {
  const time = +new Date()
  const tmpFile = file + '.' + time + '-tmp'

  try {
    // 不要直接写, 而是先写临时文件, 然后再 move (由于 move 操作是原子的, 如果有文件同时读的话, 是不会有问题的)
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2))
    fs.renameSync(tmpFile, file)
  } catch (error) {
    console.error(error)
    // 如果发生异常, 就将 tmpFile 删除掉
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile)
    }
  }
}
/**
   * 安全写入文件内容(防止进程竞争导致文件内容损坏)
   * @param {String} file
   * @param {String} content
   */
export function safeWrite (file, content) {
  const time = +new Date()
  const tmpFile = file + '.' + time + '-tmp'

  try {
    fs.writeFileSync(tmpFile, content)
    fs.renameSync(tmpFile, file)
  } catch (err) {
    // 如果发生异常, 就将 tmpFile 删除掉
    if (fs.existsSync(tmpFile)) {
      fs.unlinkSync(tmpFile)
    }
  }
}
/**
   * 文件是否存在
   * @return {Boolean}
   */
export function exists (file) {
  try {
    return fs.statSync(file)
  } catch (err) {
    return false
  }
}
/**
   * 获取文件信息, 如果出错就返回 false
   *
   * @param  {String} file      文件名
   * @param  {Boolean} symlink  是否是符号链接
   * @return {Stats}
   */
export function fstat (file, symlink?) {
  try {
    return symlink ? fs.lstatSync(file) : fs.statSync(file)
  } catch (e) {
    return false
  }
}
/**
   * 是否是文件
   *
   * @param  {String}  file 文件路径
   * @return {Boolean}
   */
export function isFile (file) {
  const stat = fstat(file)

  return stat ? stat.isFile() : false
}
/**
   * 是否是目录
   *
   * @param  {String}  dir 目录路径
   * @return {Boolean}
   */
export function isDirectory (dir) {
  const stat = fstat(dir)

  return stat ? stat.isDirectory() : false
}
/**
   * 是否是符号链接
   *
   * @param  {String}  link 链接路径
   * @return {Boolean}
   */
export function isSymlink (link) {
  const stat = fstat(link, true)

  return stat ? stat.isSymbolicLink() : false
}
/**
   * 文件是否在某个目录下
   *
   * @param {String} file
   * @param {String} root
   * @return {Boolean}
   */
export function isUnder (file, root) {
  return path.normalize(file).indexOf(path.normalize(root)) === 0
}
/**
   * 指定目录是否属于指定用户/组
   *
   * @param {String} dir 文件名
   * @param {Object} ug  用户/组信息 { uid: ..., gid: ... }
   * @return {String}
   */
export function isBelong (file, ug) {
  const stat = fstat(file)

  if (!stat) {
    return null
  }

  if (process.platform === 'win32') {
    return true
  } else {
    return stat.uid === ug.uid
  }
}
/**
   * 修复权限
   */
export function fixFileMode (file, mode) {
  if (process.platform === 'win32' || process.getuid() !== 0) {
    return
  }

  mode = mode || 0o777

  try {
    fs.chmodSync(file, mode)
  } catch (err) {
    console.error('chmod %s failed: %s', file, err)
  }
}
/**
   * 修复owner
   */
export function fixFileOwner (file) {
  if (process.platform === 'win32' || process.getuid() !== 0) {
    return
  }

  const uid = parseInt(process.env.SUDO_UID, 10)
  const gid = parseInt(process.env.SUDO_GID, 10) || process.getgid()
  if (uid && uid !== 0) {
    try {
      fs.chownSync(file, uid, gid)
    } catch (err) {
      console.error('chown %s failed: %s', file, err)
    }
  }
}
/**
   * 创建目录
   *
   * 注: 如果目录存在, 就停止创建
   *
   * @param {String} dir
   * @return {Promise}
   */
export function mkdir (dir) {
  return new Promise((resolve, reject) => {
    if (!exists(dir)) {
      mkdirp(dir, err => {
        if (err) {
          reject(err)
        } else {
          resolve(undefined)
        }
      })
    } else {
      resolve(undefined)
    }
  })
}
/**
   * 创建目录
   *
   * 注: 如果目录存在, 就停止创建
   *
   * @param {String} dir
   */
export function mkdirSync (dir) {
  if (!exists(dir)) {
    mkdirp.sync(dir)
  }
}
/**
   * 获取目录下的所有子文件夹名
   *
   * @param {String} dir
   */
export function getAllFloderName (dir) {
  const floders = fs.readdirSync(dir)
  let res = []
  if (floders && floders.length > 0) {
    res = floders.filter(item => {
      try {
        const stat = fs.lstatSync(path.join(dir, item))
        return stat && stat.isDirectory()
      } catch (e) {
        return false
      }
    })
  }
  return res
}

/**
 * 递归往上寻找项目中某文件
 * @param  {[String]} fileName 需要查找的目标文件名称
 * @return {[Array]}  返回找到目标文件的目录路径，放在一个数组里
 */
export function getExistFile (fileName: string, cwd?: string): Promise<Array<string>> {
  console.trace('@deprecated getExistFile(fileName, cwd?) => getFiles(cwd?')
  return new Promise((resolve) => {
    cwd = cwd || process.cwd()
    const parts = cwd.split('/')

    function isExistFile (paths) {
      if (paths.length === 0) {
        resolve(undefined)
        // resolve(false)
        // reject(new Error('文件不存在'))
        return
      }
      const _file = `${paths.join('/')}/${fileName}`
      fs.stat(_file, (err) => {
        if (!err) {
          resolve(paths)
        } else {
          paths.pop()
          isExistFile(paths)
        }
      })
    }

    isExistFile(parts)
  })
}

/**
 * 获取指定目录下的所有文件
 * @param cwd 目录
 */
export async function getFiles (cwd = process.cwd()): Promise<Array<string>> {
  const result = []
  const walker = walk(cwd)
  walker.on('file', function (root, stats, next) {
    result.push(`${root}/${stats.name}`)
    next()
  })
  return new Promise((resolve, reject) => {
    walker.on('end', function () {
      resolve(result)
    })
  })
}

/**
 * 替换占位符
 * @param cwd @string 遍历目录
 * @param replaceer @Function 替换函数，返回新内容
 */
export async function replacePlaceholders (cwd: string, replaceer: Function): Promise<undefined> {
  const walker = walk(cwd, { filters: ['.git', 'node_modules'] })
  walker.on('file', function (base, stats, next) {
    // if (/\.git/.test(base) || /node_modules/.test(base)) {
    //   next()
    //   return
    // }
    logger.debug(`替换占位符 ${base}/${stats.name}`)
    fse.readFile(`${base}/${stats.name}`, 'utf8', (error, data) => {
      if (error) console.error(error)
      const nextData = replaceer(data)
      if (nextData === data) {
        next()
        return
      }
      fse.writeFile(`${base}/${stats.name}`, nextData, (error) => {
        if (error) console.error(error)
        next()
      })
    })
  })
  return new Promise((resolve, reject) => {
    walker.on('end', function () {
      resolve(undefined)
    })
  })
}
