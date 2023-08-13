import axios from 'axios';

export type InputsType = {
  title: string
  password: string
}

export const MakingRoomFetch = (data :InputsType, toast: any) => {
  return axios.post(
    `http://${import.meta.env.VITE_BACKEND_URL}/room`, data, {
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

