import axios from 'axios'

export interface InputsType {
  title: string
  password: string
}

export const MakingRoomFetch: any = async (data: InputsType, toast: any) => {
  return await axios.post(
    `http://${import.meta.env.VITE_BACKEND_URL}/room`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
}
