const express = require('express')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const blogRouter = express.Router()


blogRouter.get('/', async (request, response) => {
  console.log('getting blogs')
  const res = await Blog.find({})
  response.json(res)
})

blogRouter.post('/', async (request, response) => {

  console.log('posting blog', request.body)
  const authToken = request.token
  if (!authToken) {
    console.log('missing or invalid token')
    return response.status(400).send();
  }
  const decodedToken = jwt.verify(authToken, process.env.SECRET)
  console.log('decoded token', decodedToken)
  const user = await User.findById(decodedToken.id)

  if (!user){
    console.log('user not found for token')
    return response.status(400).json({error: 'user not found for token'})
  }

  // if (!user || user.username === undefined || user.id === undefined || user.name === undefined) {
  //   return response.status(400).text('user missing')
  // }
  if (request.body.title === undefined || request.body.url === undefined) {
    return response.status(400).json({error: 'missing field title or url'})
  }

  if (request.body.likes === undefined) {
    request.body.likes = 0
  }

  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    user: user
  }

  const blog = new Blog(newBlog)
  const res = await blog.save()
  response.status(201).json(res)

})

blogRouter.delete('/:id', async (request, response) => {
    
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(400).json({error: 'token missing or invalid'})
    }

    const userId = decodedToken.id

    if (!userId) {
      return response.status(400).json({error: 'user id missing'})
    }

    const user = await User.findById(userId)
    
    try{

      const blogById = await Blog.findById(request.params.id)

      if (!blogById) {
        return response.status(404).json({ error: 'blog not found' })
      }

      if (blogById.user.username !== user.username) {
        console.log('not user blog', blogById, user.username)
        return response.status(401).json({ error: 'not user blog' })
      }


      const res = await Blog.findByIdAndDelete(request.params.id)

      if (!res) {
        return response.status(404).json({ error: 'blog not found' })
      }

      response.status(200).end()
    }
    catch (error) {
      console.log('error deleting blog', error) 
      response.status(500).send();
    }
})

blogRouter.put('/:id', async (request, response) => {
  console.log('update blog request')
  const newBlog = request.body
  const res = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
  response.json(res)
})

module.exports = blogRouter