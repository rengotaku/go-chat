import axios from 'axios';

export type InputsType = {
  roomId: string
}

export const ShowRoomFetch = (data :InputsType, toast: any) => {
  const url = `http://${import.meta.env.VITE_BACKEND_URL}/room/${data.roomId}`;
  return axios.get(
    url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
  .catch(function (error) {
    console.log("エラー内容:", error);
    toast({
      title: 'サーバーエラー',
      description: "運営者の操作ミスにより、ページが表示されません。",
      status: 'error',
      duration: 9000,
    })
  });
}

