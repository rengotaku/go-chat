import { React, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
  Input,
  Container,
  FormControl,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react'
import { MakingRoomFetch } from '../fetches/MakingRoomFetch'
import { useNavigate } from 'react-router-dom'

interface Inputs {
  title: string
  password: string
  comfirmPassword: string
}

export const MakingRoom: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Inputs>()
  // const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)
  const onSubmit: SubmitHandler<Inputs> = async (submitData, e) => {
    if (submitted) {
      return
    }
    setSubmitted(true)
    e.preventDefault()

    const { data } = await MakingRoomFetch({
      title: submitData.title,
      password: submitData.password
    }, toast)

    navigate('/room/' + data.roomId)
  }

  return (
    <Container>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.title} mb={4}>
          <Input
            {...register('title',
              { required: 'ルームタイトルを入力してください。' })} placeholder='ルームタイトル' />
          <FormErrorMessage>{ errors.title?.message }</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.password} mb={4}>
          <Input
            {...register('password',
              { required: '管理パスワードを入力してください。' })} placeholder='管理パスワード' />
          <FormErrorMessage>{ errors.password?.message }</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errors.comfirmPassword} mb={4}>
          <Input
            {...register('comfirmPassword',
              {
                required: '管理パスワード(確認)を入力してください。',
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return 'パスワードが一致しません'
                  }
                }
              })} placeholder='管理パスワード(確認)' />
          <FormErrorMessage>{ errors.comfirmPassword?.message }</FormErrorMessage>
        </FormControl>

        <Input type="submit" />
      </form>
    </Container>
  )
}
