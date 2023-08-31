import axios from 'axios'

export interface InputsType {
  roomId: string
  username: string
  bearer: string
}

export const ShowRoomFetch: any = async (data: InputsType) => {
  let url = `http://${import.meta.env.VITE_BACKEND_URL}/room/${data.roomId}`

  return await axios.get(
    url, {
      params: { username: data.username, bearer: data.bearer },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
}
