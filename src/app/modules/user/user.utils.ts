import envConfig from '../../config/env.config'
import { TUser } from './user.interface'
import jwt from 'jsonwebtoken'

export interface IVarificationToken {
  code: string
  user: TUser
}

export const createVarificationToken = (user: Partial<TUser>) => {
  const code = Math.floor(1000 + Math.random() * 9000).toString()

  // create token
  const token = jwt.sign(
    { code, user },
    envConfig.ACTIVATION_SECRET as string,
    {
      expiresIn: '5m',
    },
  )
  return {
    code,
    token,
  }
}

export const verifyVarificationToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(
      token,
      envConfig.ACTIVATION_SECRET as string,
    ) as IVarificationToken
    return decodedToken
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
