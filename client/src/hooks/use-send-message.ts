import { useCallback, useState } from 'react'
import { websocketAtom } from '../state/websocket'
import { useRecoilValue, useRecoilState } from 'recoil'
import { userAtom } from '../state/user'

export interface FuncType {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  send: () => void
}

export const useSendMessage: FuncType = () => {
  const socket = useRecoilValue(websocketAtom)
  const [user] = useRecoilState(userAtom)
  const [input, setInput] = useState<string>('')

  const send = useCallback(() => {
    if (input.length === 0) return

    socket.send(JSON.stringify({ type: 'message', content: input }))
    setInput('')
  }, [input])

  return { input, setInput, send }
}
