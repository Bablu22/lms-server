/* eslint-disable no-unused-vars */
import mongoose, { Model, ObjectId } from 'mongoose'

export interface TUser {
  name: string
  email: string
  password: string
  avatar: {
    public_id: string
    url: string
  }
  role: 'user' | 'admin'
  isVerified: boolean
  courses: Array<{ courseId: ObjectId }>
}

export interface TUserModel extends Model<TUser> {
  comparePassword: (
    enteredPassword: string,
    userPassword: string,
  ) => Promise<boolean>

  isUserExist: (email: string) => Promise<boolean>
  createAccessToken: (id: mongoose.Types.ObjectId) => string
  createRefreshToken: (id: mongoose.Types.ObjectId) => string
}
