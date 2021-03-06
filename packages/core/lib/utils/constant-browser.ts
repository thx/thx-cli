/**
 * Task Process State
 * 任务线程状态
 */
export const PROCESS_STATE = {
  NEW: 'NEW', // 新建
  RUNNABLE: 'RUNNABLE', // 可运行
  RUNNING: 'RUNNING', // 运行中
  BLOCKED: 'BLOCKED', // 被阻塞
  RESOLVED: 'RESOLVED', // 成功
  REJECTED: 'REJECTED', // 失败
  FINISHED: 'FINISHED' // 结束 vs DEAD
}

/**
 * Socket Event
 * 套接字事件
 */
export const SOCKET_EVENT = {
  CONNECT: 'connect',
  CONNECTED: 'connected',
  DISCONNECT: 'disconnect',
  DISCONNECTED: 'disconnected',

  APP_INIT: 'APP_INIT',
  APP_STATE: 'APP_STATE',

  TASK_INIT: 'TASK_INIT',
  TASK_STATE: 'TASK_STATE',
  TASK_CLOSE: 'TASK_CLOSE',

  TASK_RESOLVE: 'TASK_RESOLVE',
  TASK_RESOLVED: 'TASK_RESOLVED',
  TASK_REJECT: 'TASK_REJECT',
  TASK_REJECTED: 'TASK_REJECTED',
  TASK_FINISH: 'TASK_FINISH',
  TASK_FINISHED: 'TASK_FINISHED',

  TASK_LOG: 'TASK_LOG',
  TASK_CHUNK: 'TASK_CHUNK',
  TASK_CLEAR: 'TASK_CLEAR'
}

export const METHOD_MAPS = {
  1: 'GET',
  2: 'POST',
  3: 'PUT',
  4: 'DELETE'
}
