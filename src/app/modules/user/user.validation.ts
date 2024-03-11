import { z } from 'zod'

export const userVarificationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, { message: 'Password must be at least 6 characters long' }),
})

export const registerUserSchema = z.object({
  token: z.string({
    required_error: 'Please provide a token to verify your account',
    invalid_type_error: 'Token must be a string',
  }),
  code: z.string({
    required_error: 'Please provide a code to verify your account',
    invalid_type_error: 'Code must be a string',
  }),
})

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: 'Please enter your email address',
      invalid_type_error: 'Email must be a string',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
  password: z
    .string({
      required_error: 'Please enter your password',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, { message: 'Password must be at least 6 characters long' }),
})

export const changePasswordSchema = z.object({
  oldPassword: z.string({
    required_error: 'Please enter your old password',
    invalid_type_error: 'Old password must be a string',
  }),
  newPassword: z
    .string({
      required_error: 'Please enter your new password',
      invalid_type_error: 'New password must be a string',
    })
    .min(6, { message: 'Password must be at least 6 characters long' }),
})
