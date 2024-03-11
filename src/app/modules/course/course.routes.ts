import { Router } from 'express'
import { auth } from '../../middleware/auth'
import { createCourseSchema } from './course.validation'
import { courseController } from './course.controller'
import validateRequest from '../../middleware/validate-request'
import { upload } from '../../utils/saveImageToCloudinart'

const router = Router()

// define routes
router.post(
  '/create',
  auth,
  upload.single('thumbnail'),
  validateRequest(createCourseSchema),
  courseController.createCourse,
)

router.patch(
  '/edit/:id',
  auth,
  upload.single('thumbnail'),
  courseController.editCourse,
)

router.get('/:id', courseController.getSilgleCourse)
router.get('/', courseController.getAllCourses)
router.post('/purchase/:id', auth, courseController.createPurchaseCourse)

export const courseRoutes = router
