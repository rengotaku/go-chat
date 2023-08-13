import { useMessageList } from "../hooks/use-message-list";

export const MessageList = () => {
  const messageList = useMessageList();

  return (
    <>
      {messageList.map((m, i) => (
        <div key={i}>{m.content}</div>
      ))}
    </>
  );
};
