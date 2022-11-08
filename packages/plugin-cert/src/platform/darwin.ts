import { exec, execSync } from 'child_process'

export function addStore(certificatePath) {
  return new Promise((resolve, reject) => {
    console.log('添加证书 %o 到系统钥匙串', certificatePath)

    exec(
      `sudo security add-trusted-cert \
      -d -r trustRoot \
      -k /Library/Keychains/System.keychain \
      '${certificatePath}'`,
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
  console.log('查询钥匙串里名称是%o的证书', CN)
  let sha1List
  try {
    // 钥匙串里没有时执行下面会抛错
    const sha1Str = execSync(
      `security find-certificate -a -c '${CN}' -Z | grep ^SHA-1`,
      { encoding: 'utf-8' }
    )
    sha1List = sha1Str
      .replace(/SHA-1\shash:\s/g, '')
      .split('\n')
      .filter(sha1 => sha1)
  } catch (e) {
    sha1List = []
  }
  console.log('查询到的sha1 %o', sha1List)
  return sha1List
}

export function removeFromStore(certificateName) {
  return new Promise((resolve, reject) => {
    try {
      execSync(`sudo security delete-certificate -c "${certificateName}"`)
      resolve(null)
    } catch (error) {
      reject(error)
    }
  })
}
