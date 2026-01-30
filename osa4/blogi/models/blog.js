const mongoose = require('mongoose')
const User = require('./user')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    username: String,
    name: String,
    id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
