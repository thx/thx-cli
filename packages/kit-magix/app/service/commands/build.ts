import { utils } from '@ali/mm-cli-core'

/**
 */
import * as chalk from 'chalk'
import { CommanderStatic } from 'commander'
import buildApi from '../apis/build'
//
export default async (command: CommanderStatic) => {
  const branch = await utils.getPrecentBranch()

  buildApi
    .exec({
      branch
    })
    .on('data', msg => {
      console.log(msg)
    })
    .on('close', resp => {
      if (resp.error) {
        console.log(chalk.red(`✘ ${resp.error}`))
      }
    })
}
