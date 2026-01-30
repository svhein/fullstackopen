const bcrypt = require('bcryptjs')
const User = require('../models/user')
const dotenv = require('dotenv')
const supertest = require('supertest')
const app = require('../index')
const { test, after, beforeEach, describe, before} = require('node:test')
const assert = require('assert')
const api = supertest(app)
const mongoose = require('mongoose')
const helper = require('../utils/list_helper')
dotenv.config()
//...

let userToken = ''

before(async () => {    
    // check database connection before tests
    console.log('connecting to database...')
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 })
    console.log('connected to database')

    // delete all users
    console.log('deleting all users')
    await mongoose.connection.collection('users').deleteMany({})
    console.log('all users deleted')

    // create test user
    // create test user
    console.log('creating test user')
    const newUser = {
        username: 'taneli',
        name: 'tanelijormala',
        password: 'salainen',
    }
    const regRes = await api
        .post('/api/user')
        .send(newUser)
        .expect(200)
    console.log('test user created')

    userToken = regRes.body.token
    console.log('user token:', userToken)
})








describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jjo3rm122222',
      name: 'Jorma J3ormal3322a',
      password: 'salainen',
    }

    await api
      .post('/api/user')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('cannot create user with bad password', async () => {

    const newUser = {
      username: 'kalle',
      name: 'kddda',
      password: 'sa',
    }

    await api
      .post('/api/user')
      .send(newUser)
      .expect(400)
  })

  test('cannot create user with short username', async () => {
    const newUser = {
      username: 'ka',
      name: 'kddda',
      password: 'dwdedefefwew'
    }
    await api
      .post('/api/user')
      .send(newUser)
      .expect(400)
  })
  test('login {user: taneli, password: salainen} succeeds', async () => {

    const newUser = {
        username: 'taneli',
        name: 'tanelijormala',
        password: 'salainen',
    }
    const regRes = await api
        .post('/api/user')
        .send(newUser)
        .expect(200)

    const loginUser = {
      username: 'taneli',
      password: 'salainen'
    }
    await api
      .post('/api/login')
      .send(loginUser)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
  })

  test('login with wrong password fails', async () => {
    const loginUser = {
      username: 'taneli',
      password: 'hmmme'
    }
    await api
      .post('/api/login')
      .send(loginUser)
      .expect(401)
  })
})

after(async () => {
    await mongoose.connection.close()
    console.log('database connection closed')
})