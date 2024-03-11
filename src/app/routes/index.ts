import { Router } from 'express'
import { userRoutes } from '../modules/user/user.routes'
import { courseRoutes } from '../modules/course/course.routes'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    routes: userRoutes,
  },
  {
    path: '/course',
    routes: courseRoutes,
  },
]

moduleRoutes.forEach(route => {
  router.use(route.path, route.routes)
})

export default router
