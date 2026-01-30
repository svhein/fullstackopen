const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {

  console.log('user post request')
  console.log(request.body)

  const { username, name, password } = request.body

  console.log('creating user:', username, name)

  if (!password || password.length < 3) {
    console.log('password too short')
    return response.status(400).send('Password too short')
  }
  if (!username || username.length < 3) {
    console.log('username too short')
    return response.status(400).send('Username too short')
  }

  const userExists = await User.findOne({ username })
  if (userExists) {
    console.log('user already exist')
    return response.status(405).json({error: 'user already exist'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  console.log('new user saved:', savedUser)

  response.status(200).json(savedUser)
})

module.exports = usersRouter