import React from 'react'
import { Flex, Text } from '@chakra-ui/react'

interface Props {
  title: string
}

export const Header: React.FC<Props> = ({ title }) => {
  return (
    <Flex as="header"
      w="100%"
      h="7"
      position="fixed"
      top="0"
      zIndex="1000"
      bg="black"
      color="white"
    >
      <Text fontSize="lg" fontWeight="bold" ml="3">
        { title }
      </Text>
{/*
      <Avatar size="lg" name="Dan Abrahmov" src="https://bit.ly/dan-abramov">
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          Ferin Patel
        </Text>
        <Text color="green.500">Online</Text>
      </Flex>
 */}
    </Flex>
  )
}
