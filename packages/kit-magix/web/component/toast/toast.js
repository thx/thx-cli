import './toast.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { Overlay, Message } from '@alifd/next'

const id = 'global-toast-container'
const timeout = 3000

let messages = []
let uuid = 0

class Toast extends React.Component {
  static run (messages) {
    const container = Toast.init()
    ReactDOM.render(<Toast visible={messages.length > 0} messages={messages} />, container)
  }

  static init () {
    let container = document.getElementById(id)
    if (!container) {
      container = document.createElement('div')
      container.setAttribute('id', id)
      document.body.appendChild(container)
    }

    return container
  }

  static show (msg, auto = true, level = 'warning') {
    const id = `item-${uuid++}-${new Date().getTime()}`
    messages.unshift({
      id,
      message: msg,
      level: level
    })

    while (messages.length > 10) {
      messages.pop()
    }

    Toast.run(messages)

    if (auto) {
      setTimeout(() => {
        this.hide(id)
      }, timeout)
    }

    return id
  }

  static hide (id) {
    messages = messages.filter(m => m.id !== id)
    Toast.run(messages)
  }

  render () {
    return (
      <Overlay
        visible={this.props.visible}
        hasMask={false}
        align='tc tc'
        offset={[0, 100]}
      >
        <ul>
          {this.props.messages.map(
            m => (
              <li key={m.id}>
                <div className='global-toast'>
                  <Message type={m.level || 'warning'} title='提示'>
                    <p className='message-body' title={m.message}>
                      {m.message}
                    </p>
                  </Message>
                </div>
              </li>
            )
          )}
        </ul>
      </Overlay>
    )
  }
}

export default Toast
