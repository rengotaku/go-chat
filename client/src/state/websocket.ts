import { atom, selector } from "recoil";
import * as WebSocket from "websocket";
import { useParams } from 'react-router-dom';

const connect = (): Promise<WebSocket.w3cwebsocket> => {
  return new Promise((resolve, reject) => {
    const { roomId } = useParams();
    // const port = import.meta.env.VITE_WS_PORT;
    // const url = "ws://localhost:" + port + "/ws" + "?roomId=" + roomId;
    const url = `ws://${import.meta.env.VITE_BACKEND_URL}/ws?roomId=${roomId}`;
    const socket = new WebSocket.w3cwebsocket(url);

    socket.onopen = () => {
      console.log("connected: ", import.meta.env.VITE_BACKEND_URL);
      resolve(socket);
    };
    socket.onclose = () => {
      console.log("reconnecting...");
      connect();
    };
    socket.onerror = (err) => {
      console.log("connection error:", err);
      reject(err);
    };
  });
};

const connectWebsocketSelector = selector({
  key: "connectWebsocket",
  get: async (): Promise<WebSocket.w3cwebsocket> => {
    return await connect();
  },
});

export const websocketAtom = atom<WebSocket.w3cwebsocket>({
  key: "websocket",
  default: connectWebsocketSelector,
});
