export default async function (_resp) {
  const resp = JSON.parse(_resp)
  const config = JSON.stringify(resp.result.data, null, 2)

  return `
/**
 * @magix-cli
 * 配合数据小站的埋点功能，由mx spmlog自动生成，请勿手动修改！
 * 数据修改请上数据小站，然后本地执行mx spmlog即可
 */

module.exports = ${config}
`
}
