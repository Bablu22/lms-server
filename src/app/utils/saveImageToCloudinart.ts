import { v2 as cloudinary } from 'cloudinary'
import envConfig from '../config/env.config'
import { UploadApiResponse } from 'cloudinary'
import fs from 'fs'
import multer from 'multer'
import AppError from '../error/AppError'
import httpStatus from 'http-status'

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
})

export const sendImageToCloudinary = (imageName: string, path: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName.trim(),
        folder: 'lms',
        width: 150,
        height: 150,
        crop: 'fill',
      },
      function (error, result) {
        if (error) {
          reject(error)
        }
        resolve(result as UploadApiResponse)
        fs.unlink(path, err => {
          if (err) {
            console.log(err)
          } else {
            console.log('File is deleted.')
          }
        })
      },
    )
  })
}

export const deleteImageFromCloudinary = (publicId: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, function (error, result) {
      if (error) {
        reject(error)
      }
      resolve(result)
    })
  })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/')
  },
  filename: function (req, file, cb) {
    const types = ['image/png', 'image/jpeg', 'image/jpg']
    if (!types.includes(file.mimetype)) {
      return cb(
        new AppError(
          httpStatus.BAD_REQUEST,
          'Only jpeg, jpg and png files are allowed',
        ),
        '',
      )
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = file.originalname.split('.').pop()
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext)
  },
})

export const upload = multer({ storage: storage })
