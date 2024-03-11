/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction } from 'express'
import AppError from '../error/AppError'
import { ZodError } from 'zod'
import envConfig from '../config/env.config'

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next: NextFunction,
) => {
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]

  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message.split(':')[1] || err.message
    errorSource = [
      {
        path: '',
        message: err.message.split(':')[1] || err.message,
      },
    ]
  }

  if (err instanceof ZodError) {
    statusCode = 400
    message = 'Invalid data provided!'
    errorSource = err.errors.map(error => {
      return {
        path: error.path.join('.'),
        message: error.message,
      }
    })
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token!'
    errorSource = [
      {
        path: '',
        message: 'Invalid token!',
      },
    ]
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired!'
    errorSource = [
      {
        path: '',
        message: 'Token expired!',
      },
    ]
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation error!'
    errorSource = err.details.map((error: any) => {
      return {
        path: error.path.join('.'),
        message: error.message,
      }
    })
  }

  if (err.code === 11000) {
    statusCode = 400
    message = 'Duplicate field value entered'
    errorSource = [
      {
        path: '',
        message: 'Duplicate field value entered',
      },
    ]
  }

  if (err.message.includes('CastError')) {
    statusCode = 400
    message = 'Invalid data provided!'
    errorSource = [
      {
        path: '',
        message: 'Invalid data provided!',
      },
    ]
  }

  if (err.name === 'SyntaxError') {
    statusCode = 400
    message = 'Invalid JSON!'
    errorSource = [
      {
        path: '',
        message: 'Invalid JSON!',
      },
    ]
  }

  if (err.name === 'MulterError') {
    statusCode = 400
    message = 'Invalid file type!'
    errorSource = [
      {
        path: '',
        message: 'Invalid file type!',
      },
    ]
  }
  if (envConfig.NODE_ENV === 'development') {
    console.log(err)
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    stack: envConfig.NODE_ENV === 'development' ? err.stack : null,
  })
}

export default errorHandler
