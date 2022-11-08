import { execSync } from 'child_process'

export function addStore(certificatePath) {
  return new Promise((resolve, reject) => {
    try {
      execSync(
        `sudo cp ${certificatePath} /usr/local/share/ca-certificates/devcert.crt`
      )
      execSync('sudo update-ca-certificates')
      resolve(null)
    } catch (e) {
      reject(e)
    }
  })
}
