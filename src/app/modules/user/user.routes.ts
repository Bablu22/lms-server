import { Router } from 'express'
import { userController } from './user.controller'
import validateRequest from '../../middleware/validate-request'
import {
  changePasswordSchema,
  loginUserSchema,
  registerUserSchema,
  userVarificationSchema,
} from './user.validation'
import { auth } from '../../middleware/auth'
import { upload } from '../../utils/saveImageToCloudinart'

const router = Router()

router.post(
  '/send-varification-token',
  validateRequest(userVarificationSchema),
  userController.sendVarificationToken,
)

router.post(
  '/register',
  validateRequest(registerUserSchema),
  userController.registerUser,
)
router.post(
  '/login',
  validateRequest(loginUserSchema),
  userController.loginUser,
)

router.get('/logout', auth, userController.logoutUser)
router.get('/refresh-token', userController.updateAccessAndRefreshToken)

router.get('/me', auth, userController.getMe)
router.get('/user/:id', auth, userController.getUserById)
router.post('/social-auth', userController.socialAuth)
router.put(
  '/update-password',
  auth,
  validateRequest(changePasswordSchema),
  userController.updatePassword,
)

router.put(
  '/update-profile',
  auth,
  upload.single('avatar'),
  userController.updateProfile,
)

export const userRoutes = router
