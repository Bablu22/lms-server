import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import envConfig from '../config/env.config'
import { redis } from '../config/redis.config'

export const auth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this route',
      })
    }

    // verify token
    const decodedToken = jwt.verify(
      accessToken,
      envConfig.ACCESS_TOKEN_SECRET as string,
    ) as JwtPayload

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
      })
    }

    const user = await redis.get(decodedToken.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    req.user = JSON.parse(user)
    next()
  },
)

export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
} as const

export type TUserRole = keyof typeof USER_ROLE

export const role = (...roles: TUserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(roles)

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this route',
      })
    }
    next()
  }
}
