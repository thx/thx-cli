import { exec, execSync } from 'child_process'

export function addStore(certificatePath) {
  return new Promise((resolve, reject) => {
    exec(
      `certutil -addstore -user root ${certificatePath}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error)
        } else {
          resolve(null)
        }
      }
    )
  })
}

export function getKeyChainCertSha1List(CN) {
  let sha1List
  try {
    // 钥匙串里没有时执行下面会抛错
    const sha1Str = execSync(
      `certutil -verifystore -user root "${CN}" | findstr sha1`,
      { encoding: 'utf8' }
    )
    sha1List = sha1Str
      .split('\n')
      .map(item => {
        return item
          .replace(/.*\(sha1\):\s/, '')
          .replace(/[\s\r]/g, '')
          .toUpperCase()
      })
      .filter(Boolean)
  } catch (e) {
    console.log('获取钥匙串里证书失败%o', e)
    sha1List = []
  }
  return sha1List
}

export function removeFromStore(certificateName) {
  return new Promise((resolve, reject) => {
    try {
      execSync(`certutil -delstore -user root "${certificateName}"`)
      resolve(null)
    } catch (error) {
      reject(error)
    }
  })
}
