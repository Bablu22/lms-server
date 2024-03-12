import httpStatus from 'http-status'
import AppError from '../../error/AppError'
import Course from './course.model'
import { Request } from 'express'
import {
  deleteImageFromCloudinary,
  sendImageToCloudinary,
} from '../../utils/saveImageToCloudinart'
import { UploadApiResponse } from 'cloudinary'
import { redis } from '../../config/redis.config'
import User from '../user/user.model'
import mongoose from 'mongoose'

const createCourse = async (req: Request) => {
  try {
    const file = req.file
    const imageName = `${req.body.name}-${Date.now()}.png`
    const path = file?.path

    const { secure_url, public_id } = (await sendImageToCloudinary(
      imageName,
      path!,
    )) as UploadApiResponse

    const course = await Course.create({
      ...req.body,
      thumbnail: {
        url: secure_url,
        public_id,
      },
    })
    return course
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const editCourse = async (req: Request) => {
  try {
    const courseId = req.params.id
    const course = await Course.findById(courseId)
    if (!course) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
    }
    const data = req.body
    const file = req.file
    if (file) {
      const imageName = `${req.body.name}-${Date.now()}.png`
      const path = file.path
      //delete old image from cloudinary

      if (course.thumbnail) {
        await deleteImageFromCloudinary(course.thumbnail.public_id)
      }

      //send image to cloudinary
      const { secure_url, public_id } = (await sendImageToCloudinary(
        imageName,
        path,
      )) as UploadApiResponse

      data.thumbnail = {
        url: secure_url,
        public_id,
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: data,
      },
      {
        new: true,
      },
    )
    return updatedCourse
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const getSingleCourse = async (req: Request) => {
  try {
    const courseId = req.params.id

    // redis caching
    const cashedData = await redis.get(courseId)

    if (cashedData) {
      return JSON.parse(cashedData)
    } else {
      const course = await Course.findById(courseId).select('-courseData')
      if (!course) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
      }
      // store data in redis
      await redis.set(courseId, JSON.stringify(course))
      return course
    }
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const getAllCourses = async () => {
  try {
    const isCashedDta = await redis.get('courses')
    if (isCashedDta) {
      return JSON.parse(isCashedDta)
    } else {
      const courses = await Course.find().select('-courseData')
      await redis.set('courses', JSON.stringify(courses))
      return courses
    }
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}
const createPurchaseCourse = async (req: Request) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    const courseId = req.params.id
    const userId = req.user._id
    const course = await Course.findById(courseId)
    if (!course) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
    }

    const user = await User.findById(userId)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    const isPurchased = user.courses.some(
      course => course.courseId.toString() === courseId.toString(),
    )

    if (isPurchased) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Course already purchased')
    }

    user.courses.push({ courseId } as never)

    // Increment purchased count in the Course model
    const purchase = await Course.findByIdAndUpdate(
      courseId,
      { $inc: { purchased: 1 } },
      { new: true },
    )

    await user.save({ session })
    await redis.set(userId, JSON.stringify(user))
    await session.commitTransaction()
    session.endSession()

    return purchase
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const createQuestion = async (req: Request) => {
  try {
    const courseId = req.params.id
    const course = await Course.findById(courseId)
    if (!course) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
    }
    const { question, contentId } = req.body

    const courseData = course.courseData.find(
      (item: any) => item._id.toString() === contentId,
    )
    if (!courseData) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course data not found')
    }
    courseData.questions.push({
      content: question,
      user: req.user,
      createdAt: new Date(),
    })
    await course.save()
    return question
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

const repliesQuestion = async (req: Request) => {
  try {
    const courseId = req.params.id
    const course = await Course.findById(courseId)
    if (!course) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
    }
    const { question, contentId, questionId } = req.body

    const courseData = course.courseData.find(
      (item: any) => item._id.toString() === contentId,
    )
    if (!courseData) {
      throw new AppError(httpStatus.NOT_FOUND, 'Course data not found')
    }
    const questionData = courseData.questions.find(
      (item: any) => item._id.toString() === questionId,
    )
    if (!questionData) {
      throw new AppError(httpStatus.NOT_FOUND, 'Question not found')
    }

    if (!questionData.replies) {
      questionData.replies = []
    }

    questionData.replies.push({
      content: question,
      user: req.user,
      createdAt: new Date(),
    })

    await course.save()
    return question
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error)
  }
}

export const courseService = {
  createCourse,
  editCourse,
  getSingleCourse,
  getAllCourses,
  createPurchaseCourse,
  createQuestion,
  repliesQuestion,
}
