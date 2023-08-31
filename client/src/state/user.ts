import { type User } from '../models/user'
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const userAtom = atom<User>({
  key: 'user',
  default: {},
  effects_UNSTABLE: [persistAtom]
})
