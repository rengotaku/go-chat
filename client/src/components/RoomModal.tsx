import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"
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
} from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState, SetterOrUpdater} from 'recoil';
import { User } from "../models/user";
import { messageListAtom } from "../state/messages";

type Props = {
    setUser: SetterOrUpdater<User>;
    roomId: any;
}

type Inputs = {
  userName: string
}

export const RoomModal: React.FC<Props> = ({ setUser, roomId }) => {
  const setMessageList = useSetRecoilState(messageListAtom);
  const {
    register,
    // handleSubmit,
    // watch,
    formState: { errors, isValid, isValidating },
    trigger,
    getValues
  } = useForm<Inputs>()

  const { onClose } = useDisclosure()

  // https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  // Inputed user name
  useEffect(() => {
console.log("aaaaaaaaaa");
    if (!isValid) { return; }

    setUser({ roomId: roomId, uuid: uuidv4().slice(-8), name: getValues("userName") });
    setMessageList([]);
    onClose();
  }, [isValidating]);

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
          <FormControl  isInvalid={errors.userName}>
            <FormLabel>あなたの名前</FormLabel>
            <Input
              {...register("userName",
                { required: "名前を入力してください。",
                })} placeholder='名前' />
            <FormErrorMessage>{ errors.userName && errors.userName.message }</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          {/* <Input type="submit" /> */}
          <Button colorScheme='blue' mr={3} onClick={() => {
            trigger()
                    }}
            >
            決定
          </Button>
        </ModalFooter>
      </ModalContent>
    </form>
    </Modal>
  );
}
