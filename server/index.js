const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const connectDB = require('./src/config/db')
const logger = require('./src/logger/logger')
const errorHandler = require('./src/middlewares/errorHandler')

const authRoute = require('./src/router/authRouter')
const topicRoute = require('./src/router/topicRouter')
const lessonRoute = require('./src/router/lessonRouter')
const pageRoute = require('./src/router/pageRouter')
const teacherManagementRoute = require('./src/router/teacherManagementRouter')
const classRoute = require('./src/router/classRouter')
const tokenRoute = require('./src/router/tokenRouter')
const userRoute = require('./src/router/userRouter')
const issueRoute = require('./src/router/issueRouter')
const progressRoute = require('./src/router/progressRouter')
const quizRoute = require('./src/router/quizRouter')
const userActivityRoute = require('./src/router/userActivityRouter')

const app = express()
const port = process.env.PORT || 5000

app.use(logger.logRequest)

// Configure Express to parse JSON requests with a maximum size limit of 50mb
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 1000000 }))

const corsOptions = {
  origin: process.env.CLIENT, // replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.use(cookieParser())

app.get('/health-check', (req, res) => {
  res.send('server is healthy!!')
})

app.use('/auth/api', authRoute)
app.use('/topics/api', topicRoute)
app.use('/lessons/api', lessonRoute)
app.use('/pages/api', pageRoute)
app.use('/teacher-management/api', teacherManagementRoute)
app.use('/class/api', classRoute)
app.use('/token/api', tokenRoute)
app.use('/user/api', userRoute)
app.use('/issues/api', issueRoute)
app.use('/progress/api', progressRoute)
app.use('/quizzes/api', quizRoute)
app.use('/user-activities/api', userActivityRoute)

app.use(errorHandler)

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)

    app.listen(port, () => {
      logger.info(`Server is now listening on ${port}`)
    })
  } catch (error) {
    logger.logError(`Error starting server: ${error.message}`)
  }
}

start() 