import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Flex,
  useToast,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';

import { useSendMessage } from "../hooks/use-send-message";

import { Header } from "../components/Header";
import { Divider } from "../components/Divider";
import { Messages } from "../components/Messages";
import { Footer } from "../components/Footer";

// import { MessageInput } from "./MessageInput";

import { MessageList } from "../components/MessageList";
import { ShowRoomFetch } from '../fetches/ShowRoomFetch';

export const Room = () => {
  const toast = useToast()

  const { roomId } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ['ShowRoomFetch'],
    queryFn: async () => {
      const response = await ShowRoomFetch({
        roomId: roomId,
      }, toast);
      const data = await response.data;
      return data;
    },
    // https://github.com/TanStack/query/issues/3432#issuecomment-1079397743
    suspense: true, staleTime: Infinity, cacheTime: 0
  })
  if( isLoading ) return ( <h1>Loading....</h1>)
  // if( getQuery.isError ) return (<h1>Error loading data!!!</h1>)

  const { input, setInput, send } = useSendMessage();

  useEffect(() => {
    document.title = data.title;
  }, []);

  return (
    <>
      <Flex w="100%" h="100vh" justify="center" align="center">
        {/* <Flex w="40%" h="90%" flexDir="column"> */}
        <Flex w="100%" h="90%" flexDir="column">
          <Header />
          {/* <MessageInput /> */}
          {/* <MessageList /> */}
          <Divider></Divider>
        	<Messages></Messages>
          
          <Footer
                    inputMessage={input}
                    setInputMessage={setInput}
                    handleSendMessage={send}
            />
        </Flex>
      </Flex>
    </>
  );
};
