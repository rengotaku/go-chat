import { useSendMessage } from "../hooks/use-send-message";

export const MessageInput = () => {
  const { input, setInput, send } = useSendMessage();

  return (
    <>
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="new message"
      />
      <button onClick={send}>Send</button>
    </>
  );
};
