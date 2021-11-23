import { EventEmitter } from 'events'
import { createModelFromIntfs } from '@ali/rapper'
import * as chalk from 'chalk'

export default (intfs, rapProjectId, servicePath) => {
  const emitter = new EventEmitter()

  setTimeout(async () => {
    if (rapProjectId == null || rapProjectId == '') {
      emitter.emit('close', {
        error: 'Rapper: no rapProjectId in package.json'
      })
      return
    }

    emitter.emit('data', chalk.green('♨ 正在执行Rapper生成文件，请稍候...'))

    try {
      await createModelFromIntfs({
        intfs,
        projectId: Number(rapProjectId),
        modelPath: `${servicePath}/model-itf.ts`,
        requesterPath: `${servicePath}/requester.ts`,
        baseFetchPath: `${servicePath}/base-fetch.ts`,
        additionalProperties: false,
        optionalExtra: true
      })
      emitter.emit('data', chalk.green('✔ Rapper文件生成成功'))
      emitter.emit('close', {})
    } catch (error) {
      emitter.emit('close', {
        error: `Rapper文件生成失败, ${error}`
      })
      // spinner.fail(chalk.red(`rapper: generate model failed, ${error}`))
    }
  }, 0)

  return emitter
}
