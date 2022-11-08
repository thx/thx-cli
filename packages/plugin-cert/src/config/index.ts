import * as path from 'path'
import { applicationConfigPath } from './application-config-path'

const SSL_CERTIFICATE_DIR = applicationConfigPath('selfcert')
const SSL_CONFIG_FILE = path.join(SSL_CERTIFICATE_DIR, './ssl-config.json')
const SSL_KEY_PATH = path.join(SSL_CERTIFICATE_DIR, './ssl.key')
const SSL_CRT_PATH = path.join(SSL_CERTIFICATE_DIR, './ssl.crt')
const CN = 'generated by MM-CLI'
const DEFAULT_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '*.taobao.com',
  '*.taobao.net',
  '*.m.taobao.com',
  '*.alimama.com',
  '*.alimama.net',
  '*.tanx.com',
  '*.alibaba-inc.com',
  '*.tmall.com',
  '*.tmall.net'
]
const VALIDITY_DAYS = 3650

export {
  SSL_CERTIFICATE_DIR,
  SSL_CONFIG_FILE,
  SSL_KEY_PATH,
  SSL_CRT_PATH,
  CN,
  DEFAULT_DOMAINS,
  VALIDITY_DAYS
}
