import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import mongoose, { Schema, model } from 'mongoose'
import { TUser, TUserModel } from './user.interface'
import envConfig from '../../config/env.config'

const userSchema = new Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      validate: {
        validator: function (v: string) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
          return emailRegex.test(v)
        },
        message: 'Please enter a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: 6,
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

userSchema.statics.comparePassword = async function (
  enteredPassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(enteredPassword, userPassword)
}

userSchema.statics.isUserExist = async function (email: string) {
  const user = await this.findOne({ email })
  return user ? true : false
}

userSchema.statics.createAccessToken = function (id: mongoose.Types.ObjectId) {
  return jwt.sign({ id }, envConfig.ACCESS_TOKEN_SECRET as string, {
    expiresIn: '15m',
  })
}

userSchema.statics.createRefreshToken = function (id: mongoose.Types.ObjectId) {
  return jwt.sign({ id }, envConfig.REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
  })
}

const User = model<TUser, TUserModel>('User', userSchema)

export default User
