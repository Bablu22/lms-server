import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import { AnyZodObject } from 'zod'

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validatedBody = schema.parse(req.body)
    req.body = validatedBody
    next()
  })
}

export default validateRequest
