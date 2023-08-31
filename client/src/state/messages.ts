import { type Message } from '../models/message'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const messageListAtom = atom<Message[]>({
  key: 'messageList',
  default: [],
  effects_UNSTABLE: [persistAtom]
})
