import React from "react";
import { Flex, Input, Button } from "@chakra-ui/react";

type Props = {
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
}

export const Footer: React.FC<Props> = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  return (
    <Flex
      w="100%"
      mt="5"
      p="3"
      position="fixed"
      bottom="0"
      zIndex="1001"
    >
      <Input
        placeholder="Type Something..."
        border="none"
        borderRadius="none"
        _focus={{
          border: "1px solid black",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <Button
        bg="black"
        color="white"
        borderRadius="none"
        _hover={{
          bg: "white",
          color: "black",
          border: "1px solid black",
        }}
        disabled={inputMessage.trim().length <= 0}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Flex>
  );
}
