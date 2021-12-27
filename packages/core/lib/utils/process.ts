import {
  exec,
  execSync,
  spawn as _spawn,
  spawnSync as _spawnSync,
  SpawnOptions,
  ChildProcess
} from 'child_process'
import { LOG_GROUP } from './constant'
import logger from '../logger'

import { EventEmitter } from 'events'
import { redBright } from 'chalk'

/**
 * 新启动一个线程，并返回 EventEmitter
 * @param command string
 * @param args Array<string>
 * @param options SpawnOptions
 */
export function spawnWithEmitter(
  command: string,
  args: Array<string>,
  options: SpawnOptions
): EventEmitter {
  const emitter = new EventEmitter()
  const subprocess = _spawn(command, args, {
    stdio: 'pipe',
    ...options
  })

  subprocess.on('message', message => emitter.emit('data', message))
  if (subprocess.stdout) {
    subprocess.stdout.on('data', chunk => emitter.emit('data', chunk))
  }
  if (subprocess.stderr) {
    subprocess.stderr.on('data', error => emitter.emit('error', error))
  }
  subprocess.on('error', error => emitter.emit('error', error))
  subprocess.on('close', (code, signal) => emitter.emit('close', code, signal))
  subprocess.on('exit', (code, signal) => emitter.emit('exit', code, signal))

  return emitter
}

export function spawnWithPromise(
  command: string,
  args: Array<string>,
  options: SpawnOptions = {}
): Promise<number> {
  return new Promise((resolve, reject) => {
    spawnWithEmitter(command, args, options).on('close', (code, signal) => {
      if (code === 0 || code === null) resolve(code)
      else reject(code)
    })
  })
}

/**
 * 执行系统命令，包括 init, install, uninstall
 * @deprecated
 */
export function execSystemCommand(command, params) {
  console.trace(
    '废弃，不建议使用 `api.execSystemCommand(command, params)`，请直接调用 `/commands/<command>`。'
  )

  console.log('execSystemCommand', command, params)
  const emitter = new EventEmitter()

  // setTimeout延后逻辑代码，先返回emitter，确保事件触发
  setTimeout(async () => {
    let asyncFn = await require(`./commands/${command}`)
    asyncFn = asyncFn.__esModule ? asyncFn.default : asyncFn
    asyncFn(params, emitter)
    // asyncFunc(params, emitter)
  }, 0)

  return emitter
}

/**
 * 多行命令行的间隔符号，win用'&'，mac用';'
 * @return {[string]}
 */
export function getCommandSplit() {
  let split = ';'
  if (process.platform === 'win32') {
    split = '&'
  }

  return split
}

const defaultSpawnOptions: SpawnOptions = {
  stdio: 'pipe'
}
/**
 * 包装 spawn 命令的输出
 * @param command
 * @param args
 * @param options
 * @deprecated => spawnWithEmitter(command, args, options)
 */
export function spawn(command, args, options: SpawnOptions): EventEmitter {
  logger.info(LOG_GROUP.SPAWN, command, args, options)
  const emitter: EventEmitter = new EventEmitter()
  const nextOptions: SpawnOptions = { ...defaultSpawnOptions, ...options }
  const subprocess: ChildProcess = _spawn(command, args, nextOptions)
  let errorRef = null

  if (subprocess.stdout) {
    subprocess.stdout.on('data', chunk => {
      emitter.emit('data', chunk.toString().replace(/\n$/, '')) // 去除行尾的\n
    })
  }
  if (subprocess.stderr) {
    subprocess.stderr.on('data', chunk => {
      const data = chunk.toString().replace(/\n$/, '') // 去除行尾的\n
      if (/Error:|\[ERROR\]|ERR!/.test(data)) {
        // 有 Error: 的认为是错误
        errorRef = data
        emitter.emit('error', data)
        return
      }
      emitter.emit('data', data)
    })
  }
  subprocess.on('message', message => {
    emitter.emit('data', message)
  })
  subprocess.on('error', error => {
    errorRef = error
    emitter.emit('error', error)
  })
  subprocess.on('close', code => {
    // MO TODO ~~errorRef~~
    emitter.emit('close', errorRef || code)
    // 命令结整后，如果失败，抛出失败 error s供处理
    // emitter.emit('close', { code, error: errorRef })
  })

  return emitter
}
/**
 * 执行单个命令：spawn {stdio: 'inherit'}, 类似真实环境执行命令，可保留控制台颜色
 */
export async function spawnCommand(command, args, options = {}) {
  logger.info(LOG_GROUP.SPAWN, command, args, options)
  // 默认stdio: inherit可传入自定义options
  const _options: SpawnOptions = {
    // MO TODO 不设置 any 会属性兼容报错
    stdio: 'inherit',
    shell: process.platform === 'win32' // win 下需要设置 shell 为 true
  }

  Object.assign(_options, options)

  return new Promise((resolve, reject) => {
    const sp = spawn(command, args, _options)

    sp.on('close', code => {
      resolve(code)
    })

    sp.on('error', error => {
      console.error(error)
      reject(error)
    })

    sp.on('exit', code => {
      resolve(code)
    })
  })
}

/**
 * 执行单个命令（子进程降权版本）：spawn {stdio: 'inherit'}, 类似真实环境执行命令，可保留控制台颜色
 */
export async function spawnDowngradeSudo(command, args, options = {}) {
  logger.info(LOG_GROUP.SPAWN, command, args, options)
  // 默认stdio: inherit可传入自定义options
  const _options: SpawnOptions = {
    // MO TODO 不设置 any 会属性兼容报错
    stdio: 'inherit',
    shell: process.platform === 'win32' // win 下需要设置 shell 为 true
  }
  Object.assign(_options, options)

  // 降权
  if (process.env.SUDO_GID) {
    _options.gid = parseInt(process.env.SUDO_GID, 10)
  }
  if (process.env.SUDO_UID) {
    _options.uid = parseInt(process.env.SUDO_UID, 10)
  }

  return new Promise((resolve, reject) => {
    const sp = spawn(command, args, _options)

    sp.on('close', code => {
      resolve(code)
    })

    sp.on('error', error => {
      console.error(error)
      reject(error)
    })

    sp.on('exit', code => {
      resolve(code)
    })
  })
}

/**
 * 执行单个命令：spawn {stdio: 'inherit'}, 类似真实环境执行命令，可保留控制台颜色
 * 同步版本
 */
export function spawnCommandSync(command, args, options = {}) {
  // 默认stdio: inherit可传入自定义options
  const _options: any = {
    stdio: 'inherit',
    shell: process.platform === 'win32' // win下需要设置shell为true
  }

  Object.assign(_options, options)

  return new Promise(resolve => {
    const result = _spawnSync(command, args, _options)
    resolve(result)
  })
}

/**
 * 执行控制台命令
 * @return {[type]} [description]
 */
export function execCommand(command, options = {}) {
  const _options = Object.assign(
    {
      // 设大一点，防止超出子进程挂掉，默认200 * 1024
      // https://div.io/topic/1516
      maxBuffer: 20000 * 1024
    },
    options
  )

  const child = exec(command, _options)

  return new Promise((resolve, reject) => {
    child.stdout.on('data', data => {
      if (data) {
        console.log(data.toString().replace(/[\n\r]+$/g, ''))
        //
        if (data.includes('listen EACCES')) {
          reject(new Error('80端口需要 sudo 权限'))
        }
      }
    })
    child.stderr.on('data', data => {
      if (data) {
        //
        if (
          data.includes('fatal: ') ||
          data.includes('execution error:') ||
          data.includes('Error: ')
        ) {
          reject(data)
        }
        console.log(data.toString().replace(/[\n\r]+$/g, ''))
      }
    })

    child.on('close', () => {
      resolve(null)
    })
    child.on('error', err => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 执行commandline
 * @return {[type]} [description]
 */
export function execCommandSync(command, options) {
  // log(LOG_GROUP.EXEC, command, options)
  logger.info(LOG_GROUP.EXEC, command, options)
  const _options = Object.assign({}, options)

  // const child = execSync(command, _options)
  execSync(command, _options)
}

/**
 * 执行单个命令并返回结果
 * @param  {[type]} command [description]
 * @return {[type]}         [description]
 */
export function execCommandReturn(command, options = {}): Promise<string> {
  const _options = Object.assign(
    {
      maxBuffer: 20000 * 1024
    },
    options
  )

  return new Promise(resolve => {
    const child = exec(command, _options)
    child.stdout.on('data', data => {
      resolve(data)
    })
    child.on('close', () => {
      resolve(null)
    })
  })
}

/**
 * 检测是否使用了 sudo 执行命令
 */
export function checkSudo() {
  if (process.env.USER === 'root') {
    console.log(
      redBright('\n✘ 请不要使用SUDO权限执行本命令，避免污染文件权限\n')
    )
    // MO 怎么办？
    return process.exit(0)
  }
}

// SUDO 降权
export function downgradingSudo() {
  // sudo下无法执行tnpm install安装，先进行降权
  console.log('❗️当前操作不允许sudo执行，已自动降权执行')
  process.setgid(parseInt(process.env.SUDO_GID, 10))
  process.setuid(parseInt(process.env.SUDO_UID, 10))
  process.env.USER = process.env.SUDO_USER
  delete process.env.SUDO_USER
}
