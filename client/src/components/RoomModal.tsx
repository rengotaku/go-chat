import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button
} from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import { messageListAtom } from '../state/messages'
import { userAtom } from '../state/user'
import { uuidv4 } from '../libs/Uuid'
import { useQuery } from '@tanstack/react-query'
import { ShowRoomFetch } from '../fetches/ShowRoomFetch'

interface Props {
  roomId: any
}

interface Inputs {
  userName: string
}

export const RoomModal: React.FC<Props> = ({ roomId }) => {
  const setMessageList = useSetRecoilState(messageListAtom)
  const setUser = useSetRecoilState(userAtom)
  const {
    register,
    formState: { errors, isValid, isValidating },
    trigger,
    getValues
  } = useForm<Inputs>()

  const { onClose } = useDisclosure()

  // if (isLoading) return (<Box textAlign="center"><Spinner size="xl" /></Box>)
  // if (error) return (<NotExistRoom />) // eslint-disable-line @typescript-eslint/strict-boolean-expressions

  // Inputed user name
  useEffect(() => {
    if (!isValid) { return }

    const asyncFunc = async() => {
      const response = await ShowRoomFetch({
        roomId: roomId,
        username: getValues('userName'),
      })
      const data = response.data;

      setUser({ roomId: roomId, uuid: data.uuid, username: data.username, bearer: data.bearer })
      setMessageList([])

      document.title = data.title

      onClose()
    }
    asyncFunc()
  }, [isValidating])

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
    >
    <form>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>入室する</ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody pb={6}>
          <FormControl isInvalid={errors.userName}>
            <FormLabel>あなたの名前</FormLabel>
            <Input
              {...register('userName',
                { required: '名前を入力してください。' })} placeholder='名前' />
            <FormErrorMessage>{ errors.userName?.message }</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          {/* <Input type="submit" /> */}
          <Button colorScheme='blue' mr={3} onClick={() => {
            trigger() // eslint-disable-line @typescript-eslint/no-floating-promises
          }}
            >
            決定
          </Button>
        </ModalFooter>
      </ModalContent>
    </form>
    </Modal>
  )
}
