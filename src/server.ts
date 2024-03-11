import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import envConfig from './app/config/env.config'

// create server
const port = envConfig.PORT || 9000
let server: Server

async function main() {
  try {
    await mongoose.connect(envConfig.MONGO_URI as string)

    server = app.listen(port, () => {
      console.log(
        `Server running on port ${port} in ${envConfig.NODE_ENV} mode 🚀`,
      )
    })
  } catch (error) {
    console.log('Error starting server: ', error)
  }
}

main()

process.on('unhandledRejection', () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`)

  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`)

  process.exit(1)
})
