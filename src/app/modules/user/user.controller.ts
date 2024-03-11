import { RequestHandler } from 'express'
import catchAsync from '../../utils/catchAsync'
import { userService } from './user.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { redis } from '../../config/redis.config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import envConfig from '../../config/env.config'
import User from './user.model'

const sendVarificationToken: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.userVarification(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Please check your email to verify your account.',
    data: result,
  })
})

const registerUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.userRegistration(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: result,
  })
})

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.userLogin(req)

  const { user, accessToken, refreshToken } = result

  // save to redis
  await redis.set(
    user._id.toString(),
    JSON.stringify(user),
    'EX',
    7 * 24 * 60 * 60,
  )

  res.cookie('refreshToken', refreshToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
  })

  res.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: 'lax',
  })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result,
  })
})

const logoutUser: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user._id

  // delete from redis
  await redis.del(userId.toString())

  res.cookie('refreshToken', '', { maxAge: 1 })
  res.cookie('accessToken', '', { maxAge: 1 })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged out successfully',
    data: {},
  })
})

const updateAccessAndRefreshToken: RequestHandler = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this route',
      })
    }

    // verify token
    const decodedToken = jwt.verify(
      refreshToken,
      envConfig.REFRESH_TOKEN_SECRET as string,
    ) as JwtPayload

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      })
    }

    const user = await redis.get(decodedToken.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    const accessToken = User.createAccessToken(decodedToken.id)
    const newRefreshToken = User.createRefreshToken(decodedToken.id)

    res.cookie('refreshToken', newRefreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    })

    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'lax',
    })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    })
  },
)

const getMe: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User details',
    data: user,
  })
})

const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User details',
    data: user,
  })
})

const socialAuth: RequestHandler = catchAsync(async (req, res) => {
  const user = await userService.socialAuth(req)

  const accessToken = User.createAccessToken(user._id)
  const refreshToken = User.createRefreshToken(user._id)

  // save to redis
  await redis.set(
    user._id.toString(),
    JSON.stringify(user),
    'EX',
    7 * 24 * 60 * 60,
  )

  res.cookie('refreshToken', refreshToken, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
  })

  res.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: 'lax',
  })

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: user,
  })
})

const updatePassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.updatePassword(req)
  await redis.set(
    result._id.toString(),
    JSON.stringify(result),
    'EX',
    7 * 24 * 60 * 60,
  )
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password updated successfully',
    data: result,
  })
})

const updateProfile: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.updateProfile(req)
  await redis.set(
    result._id.toString(),
    JSON.stringify(result),
    'EX',
    7 * 24 * 60 * 60,
  )
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: result,
  })
})

export const userController = {
  registerUser,
  loginUser,
  sendVarificationToken,
  logoutUser,
  updateAccessAndRefreshToken,
  getMe,
  getUserById,
  socialAuth,
  updatePassword,
  updateProfile,
}
