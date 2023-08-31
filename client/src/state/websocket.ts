import { atom, selector, useRecoilValue } from 'recoil'
import * as WebSocket from 'websocket'
import { userAtom } from '../state/user'

const connect = async (user: any): Promise<WebSocket.w3cwebsocket> => {
  return await new Promise((resolve, reject) => {
    // const port = import.meta.env.VITE_WS_PORT;
    // const url = "ws://localhost:" + port + "/ws" + "?roomId=" + roomId;
    const url = `ws://${import.meta.env.VITE_BACKEND_URL}/ws?bearer=${user.bearer}`
    const socket = new WebSocket.w3cwebsocket(url) // eslint-disable-line new-cap

    socket.onopen = () => {
      console.log('connected: ', import.meta.env.VITE_BACKEND_URL)
      resolve(socket)
    }
    socket.onclose = () => {
      console.log('reconnecting...')
      connect(user) // eslint-disable-line @typescript-eslint/no-floating-promises
    }
    socket.onerror = (err) => {
      console.log('connection error:', err)
      reject(err)
    }
  })
}

const connectWebsocketSelector = selector({
  key: 'connectWebsocket',
  get: async ({get}): Promise<WebSocket.w3cwebsocket> => {
    const user = get(userAtom)

    return await connect(user)
  }
})

export const websocketAtom = atom<WebSocket.w3cwebsocket>({
  key: 'websocket',
  default: connectWebsocketSelector
})
