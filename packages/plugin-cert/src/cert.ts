import * as TrustedCert from 'thx-cert'
const { install, uninstall, info, doTrust, addHosts } = TrustedCert

export default async (command, rmx) => {
  if (command.install) install()
  if (command.info) info()
  if (command.trust) doTrust()
  if (command.add) addHosts(command.add.split(',').map(item => item))
  if (command.uninstall) uninstall()
  if (!['install', 'info', 'trust', 'add', 'uninstall'].find(item => command.hasOwnProperty(item))) info()
}
