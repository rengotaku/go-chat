import { websocketAtom } from '../state/websocket'
import { messageListAtom } from '../state/messages'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { type Message } from '../models/message'

export const useMessageList = (): Message[] => {
  const socket = useRecoilValue(websocketAtom)
  const messageList = useRecoilValue(messageListAtom)

  const updateMessageList = useRecoilCallback(
    ({ set }) =>
      (message: Message) => {
        set(messageListAtom, [...messageList, message])
      }
  )
  socket.onmessage = (msg) => {
    const content = JSON.parse(msg.data as string)
    const message: Message = { content }
    updateMessageList(message)
  }

  return messageList
}
