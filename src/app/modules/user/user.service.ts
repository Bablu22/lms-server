import { Request } from 'express'
import AppError from '../../error/AppError'
import httpStatus from 'http-status'
import User from './user.model'
import {
  IVarificationToken,
  createVarificationToken,
  verifyVarificationToken,
} from './user.utils'
import ejs from 'ejs'
import path from 'path'
import { sendEmail } from '../../utils/sendEmail'
import { log } from 'console'
import {
  deleteImageFromCloudinary,
  sendImageToCloudinary,
} from '../../utils/saveImageToCloudinart'
import { UploadApiResponse } from 'cloudinary'

const userVarification = async (req: Request) => {
  try {
    const { name, email, password } = req.body

    const isUserExist = await User.isUserExist(email)
    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User already exists')
    }

    // send validation email along with the code
    const varificationCode = createVarificationToken({ name, email, password })
    const emailData = {
      name: name,
      email: email,
      code: varificationCode.code,
    }

    const html = await ejs.renderFile(
      path.join(__dirname, '../../emails/varification.mail.ejs'),
      emailData,
    )
    await sendEmail(email, 'Account Verification', html)

    return {
      token: varificationCode.token,
    }
  } catch (error: any) {
    log(error)
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const userRegistration = async (req: Request) => {
  try {
    const { token, code } = req.body

    // verify token
    const decodedToken: IVarificationToken = verifyVarificationToken(token)

    if (decodedToken.code !== code) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Please enter a valid code')
    }

    const { name, email, password } = decodedToken.user
    const isUserExist = await User.isUserExist(email)
    if (isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User already exists')
    }
    const user = await User.create({ name, email, password, isVerified: true })
    return user
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const userLogin = async (req: Request) => {
  try {
    const { email, password } = req.body
    const isUserExist = await User.isUserExist(email)
    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password')
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password')
    }

    const passwordMatch = await User.comparePassword(password, user.password)

    if (!passwordMatch) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid email or password')
    }

    // create token
    const accessToken = User.createAccessToken(user._id)
    const refreshToken = User.createRefreshToken(user._id)

    return {
      user,
      accessToken,
      refreshToken,
    }
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const getUserById = async (req: Request) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const socialAuth = async (req: Request) => {
  try {
    const { email, name, avatar } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      const newUser = await User.create({ email, name, avatar })
      return newUser
    }
    return user
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const updatePassword = async (req: Request) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    const passwordMatch = await User.comparePassword(oldPassword, user.password)
    if (!passwordMatch) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid password')
    }

    if (oldPassword === newPassword) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'New password cant be same as old password',
      )
    }

    user.password = newPassword
    await user.save()
    return user
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const updateProfile = async (req: Request) => {
  try {
    const { name } = req.body
    const avatar = req.file
    const user = await User.findById(req.user._id)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    if (name) {
      user.name = name
    }

    if (avatar) {
      //delete old image from cloudinary

      if (user.avatar) {
        await deleteImageFromCloudinary(user.avatar.public_id)
      }

      const imageName = `profile-${user._id}-${Date.now()}`
      const path = avatar.path

      //send image to cloudinary
      const { secure_url, public_id } = (await sendImageToCloudinary(
        imageName,
        path,
      )) as UploadApiResponse

      user.avatar = {
        url: secure_url,
        public_id,
      }
    }
    await user.save()
    return user
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

export const userService = {
  userVarification,
  userRegistration,
  userLogin,
  getUserById,
  socialAuth,
  updatePassword,
  updateProfile,
}
