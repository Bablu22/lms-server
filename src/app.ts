import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import envConfig from './app/config/env.config'
import notFound from './app/middleware/not-found'
import errorHandler from './app/middleware/error-handler'
import router from './app/routes'

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: envConfig.ORIGIN,
    credentials: true,
  }),
)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the API',
  })
})

// application routes
app.use('/api/v1', router)

// Middleware
app.use(errorHandler)
app.use(notFound)

export default app
