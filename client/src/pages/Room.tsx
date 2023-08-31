import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import {
  Flex,
  Box,
  Spinner
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

import { useSendMessage } from '../hooks/use-send-message'
import { ShowRoomFetch } from '../fetches/ShowRoomFetch'
import { userAtom } from '../state/user'

import { RoomModal } from '../components/RoomModal'
import { NotExistRoom } from '../components/NotExistRoom'
import { Header } from '../components/Header'
import { Messages } from '../components/Messages'
import { Footer } from '../components/Footer'

export const Room: React.FunctionComponent = () => {
  const { roomId } = useParams()
  const user = useRecoilValue(userAtom)
  // const { input, setInput, send } = useSendMessage()
  const input = ""
  const setInput = ""
  const send = ""

  useEffect(() => {
    if(typeof user.bearer === 'undefined' || user.roomId !== roomId) { return }

    const asyncFunc = async() => {
      const response = await ShowRoomFetch({
        roomId: roomId,
        bearer: user.bearer,
      })

      document.title = response.title
    }
    asyncFunc()
  }, [user])

  // if (isLoading) return (<Box textAlign="center"><Spinner size="xl" /></Box>)
  // if (error) return (<NotExistRoom />) // eslint-disable-line @typescript-eslint/strict-boolean-expressions
  if (typeof user.roomId === 'undefined' || user.roomId !== roomId) return (<RoomModal roomId={roomId} />)

  return (
    <>
      <Flex w="100%" h="100vh" justify="center" align="center">
        {/* <Flex w="40%" h="90%" flexDir="column"> */}
        <Flex w="100%" h="100%" flexDir="column">
          <Header
            title={ document.title }
          />
          <Messages></Messages>

          <Footer inputMessage={input} setInputMessage={setInput} handleSendMessage={send} />
        </Flex>
      </Flex>
    </>
  )
}
