const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Blog = require('./models/blog.js')
const blogRouter = require('./routes/blogRouter.js')
const userRouter = require('./routes/userRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const { tokenExtractor, userExtractor } = require('./utils/middleware.js')

const app = express()

app.use(express.json())

const mongoUrl = process.env.MONGODB_URI

console.log('mongo url', mongoUrl)

mongoose.connect(mongoUrl, { family: 4 }).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})


app.use(express.json())
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

const PORT = 3003

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
}

module.exports =  app 