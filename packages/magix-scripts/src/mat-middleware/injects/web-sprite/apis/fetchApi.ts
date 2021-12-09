import * as request from 'request-promise'

export default async function(api) {
  const resp = await request(api)
  const respJson = JSON.parse(resp)
  return {
    ok: true,
    data: respJson
  }
}
