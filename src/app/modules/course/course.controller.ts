import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'
import { courseService } from './course.service'

const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course created successfully',
    data: course,
  })
})

const editCourse: RequestHandler = catchAsync(async (req, res) => {
  const course = await courseService.editCourse(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course edited successfully',
    data: course,
  })
})

const getSilgleCourse: RequestHandler = catchAsync(async (req, res) => {
  const course = await courseService.getSingleCourse(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course fetched successfully',
    data: course,
  })
})

const getAllCourses: RequestHandler = catchAsync(async (req, res) => {
  const courses = await courseService.getAllCourses()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Courses fetched successfully',
    data: courses,
  })
})

const createPurchaseCourse: RequestHandler = catchAsync(async (req, res) => {
  const purchase = await courseService.createPurchaseCourse(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Course purchased successfully',
    data: purchase,
  })
})

const createQuestion: RequestHandler = catchAsync(async (req, res) => {
  const question = await courseService.createQuestion(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Question created successfully',
    data: question,
  })
})

const repliesQuestion: RequestHandler = catchAsync(async (req, res) => {
  const question = await courseService.repliesQuestion(req)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Question replied successfully',
    data: question,
  })
})

export const courseController = {
  createCourse,
  editCourse,
  getSilgleCourse,
  getAllCourses,
  createPurchaseCourse,
  createQuestion,
  repliesQuestion,
}
