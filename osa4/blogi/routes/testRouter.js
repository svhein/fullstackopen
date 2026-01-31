const bcrypt = require('bcryptjs')
const testRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
testRouter.post('/reset', async (request, response) => {

    console.log('test reset request')
    await User.deleteMany({})
    await Blog.deleteMany({})
    response.status(200).send();

})

module.exports = testRouter