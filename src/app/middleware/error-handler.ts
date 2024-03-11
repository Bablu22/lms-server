/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import AppError from '../error/AppError'
import envConfig from '../config/env.config'

// Error handler middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorSource: { path: string; message: string }[] = []

  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message.split(':')[1] || err.message
    errorSource = [{ path: '', message }]
  } else if (err instanceof ZodError) {
    statusCode = 400
    message = 'Invalid data provided!'
    errorSource = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
    }))
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token!'
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired!'
  } else if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation error!'
    errorSource = err.details.map((error: any) => ({
      path: error.path.join('.'),
      message: error.message,
    }))
  } else if (err.code === 11000) {
    statusCode = 400
    message = 'Duplicate field value entered'
    errorSource = [{ path: '', message }]
  } else if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid data provided!'
    errorSource = [{ path: '', message: `Invalid ${err.path} : ${err.value}` }]
  } else if (err.name === 'SyntaxError') {
    statusCode = 400
    message = 'Invalid JSON!'
    errorSource = [{ path: '', message }]
  } else if (err.name === 'MulterError') {
    statusCode = 400
    message = 'Invalid file uploaded!'
    errorSource = [{ path: '', message: err.message }]
  }

  if (envConfig.NODE_ENV === 'development') {
    console.error(err)
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: envConfig.NODE_ENV === 'development' ? err.stack : null,
  })
}

export default errorHandler
