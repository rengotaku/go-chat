import { useCallback, useEffect, useState, useRef } from "react";
import { websocketAtom } from "../state/websocket";
import { useRecoilValue, useRecoilState } from "recoil";

import { userAtom } from "../state/user";

export const useSendMessage = () => {
  const socket = useRecoilValue(websocketAtom);
  const [user] = useRecoilState(userAtom);
  const [input, setInput] = useState<string>("");

  const send = useCallback(() => {
    if (input.length === 0) return;

    socket.send(JSON.stringify({"type": "message", "content": input, "from": user.uuid, "name": user.name, "time": Date.now() }));
    setInput("");
  }, [input]);

  return { input, setInput, send };
};
