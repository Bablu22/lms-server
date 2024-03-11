import { Router } from 'express'
import { userRoutes } from '../modules/user/user.routes'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    routes: userRoutes,
  },
]

moduleRoutes.forEach(route => {
  router.use(route.path, route.routes)
})

export default router
