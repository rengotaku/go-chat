import React, { useEffect, useRef } from 'react'
import { Avatar, Flex, Text, Spacer } from '@chakra-ui/react'
import { useMessageList } from '../hooks/use-message-list'
import { useRecoilState } from 'recoil'

import { userAtom } from '../state/user'

export const Messages: React.FC = () => {
  const messages = useMessageList()

  const [user] = useRecoilState(userAtom)

  const AlwaysScrollToBottom: React.FC = () => {
    const elementRef = useRef()
    useEffect(() => elementRef.current.scrollIntoView())
    return <div ref={elementRef} />
  }

  function timeToStr (timestamp: string): string {
    const d = new Date(timestamp)

    return `${d.getFullYear().toString().slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}/${('0' + d.getDate()).slice(-2)} ${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}`
  }

  return (
    <Flex w="100%" h="90%" overflowY="scroll" flexDirection="column" pl="3" pr="3">
      <Flex key={0} w="100%">
        {/* dummy message for adjustment */}
        <Flex
          w='100%'
          // minW="100px"
          // maxW="350px"
          my="1"
          p="3"
          justify="center"
        >

        </Flex>
      </Flex>
      {messages.map((item, index) => {
        index = index + 1
        if (item.content.type === 'information') {
          return (
            <Flex key={index} w="100%" pt="5">
              <Flex
                bg='white'
                color="blue"
                w='100%'
                // minW="100px"
                // maxW="350px"
                my="1"
                p="3"
                justify="center"
                rounded='xl'
                boxShadow='md'
              >
                <Text>{item.content.content}</Text>
              </Flex>
            </Flex>
          )
        }

        if (item.content.from === user.uuid) { // me
          return (
            <Flex key={index} w="100%" justify="flex-end" pt="3">
              <Flex direction="column" >
                <Flex
                  bg="black"
                  color="white"
                  minW="100px"
                  maxW="350px"
                  my="1"
                  p="3"
                  rounded='md'
                >
                  <Text>{item.content.content}</Text>
                </Flex>
                <Flex w="100%">
                  <Spacer />
                  <Text fontSize='xs'>{timeToStr(item.content.time)}</Text>
                </Flex>
              </Flex>
            </Flex>
          )
        } else { // other
          return (
            <Flex key={index} w="100%" pt="3">
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="blue.300"
              ></Avatar>
              <Flex direction="column" >
                <Flex>
                  <Text fontSize='xs' as='b'>{item.content.name}</Text>
                  <Text fontSize='xs'>&nbsp;/&nbsp;</Text>
                  <Text fontSize='xs'>{item.content.from}</Text>
                </Flex>
                <Flex direction="column">
                  <Flex
                    bg="gray.100"
                    color="black"
                    minW="100px"
                    maxW="350px"
                    p="2"
                    rounded='md'
                  >
                    <Text>{item.content.content}</Text>
                  </Flex>
                  <Flex w="100%">
                    <Spacer />
                    <Text fontSize='xs'>{timeToStr(item.content.time)}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          )
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  )
}
