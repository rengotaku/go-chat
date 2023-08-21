import React, { useEffect, memo, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useSetRecoilState, SetterOrUpdater} from 'recoil';
// import { useForm, SubmitHandler } from "react-hook-form"
import {
  Flex,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  ModalFooter,
  Button,
  Box,
  Spinner
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import { messageListAtom } from "../state/messages";

import { useSendMessage } from "../hooks/use-send-message";
import { ShowRoomFetch } from '../fetches/ShowRoomFetch';
import { userAtom } from "../state/user";

import { RoomModal } from "../components/RoomModal";
import { NotExistRoom } from "../components/NotExistRoom";
import { Header } from "../components/Header";
import { Messages } from "../components/Messages";
import { Footer } from "../components/Footer";

type Inputs = {
  userName: string
}


// const MemoRoomModal = memo(function ({}) {
//   return <RoomModal isOpen={true} />;
// });

export const Room = () => {
  const { roomId } = useParams();
  const [user, setUser] = useRecoilState(userAtom);
  const { input, setInput, send } = useSendMessage();

  const { isLoading, data, error } = useQuery({
    queryKey: ['ShowRoomFetch'],
    queryFn: async () => {
      const response = await ShowRoomFetch({
        roomId: roomId,
      });
      const data = response.data;
      return data;
    },
    // This does the trick
    // onError: (err: any) => err,
    // https://github.com/TanStack/query/issues/3432#issuecomment-1079397743
    // suspense: true, staleTime: 120000, cacheTime: 120000,
    staleTime: 120000, cacheTime: 120000,
  })

  useEffect(() => {
    if (data == null) return;
    document.title = data.title;
  }, [data]);

  if( isLoading ) return (<Box textAlign="center"><Spinner size="xl" /></Box>)
  if( error ) return (<NotExistRoom />)

  if (typeof user.roomId === "undefined" && user.roomId !== roomId) return (<RoomModal setUser={setUser} roomId={roomId} />)

  return (
    <>
      <Flex w="100%" h="100vh" justify="center" align="center">
        {/* <Flex w="40%" h="90%" flexDir="column"> */}
        <Flex w="100%" h="100%" flexDir="column">
          <Header
            title={ data.title }
          />
          <Messages></Messages>

          <Footer inputMessage={input} setInputMessage={setInput} handleSendMessage={send} />
        </Flex>
      </Flex>
    </>
  );
};
