import React, { useEffect } from 'react';
import {
  Text,
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
} from '@chakra-ui/react'

export const NotExistRoom = () => {
  return (
    <>
      <Text fontSize="4xl" color='tomato'>部屋は存在しません</Text>
    </>
  );
};
