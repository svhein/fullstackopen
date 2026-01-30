const dotenv = require('dotenv')
const supertest = require('supertest')
const app = require('../index')
const { test, after, beforeEach, describe, before} = require('node:test')
const api = supertest(app)
const mongoose = require('mongoose')
const  Blog  = require('../models/blog.js')
dotenv.config()

const initialBlogs = [
    {
        title: 'eka blogi',
        author: 'toka kirjoittaja',
        url: '12323213',
        likes: 10,
    },
    {
        title: 'toka blogi',
        author: 'eka kirjoittaja',
        url: 'asdasdasd',
        likes: 5,
    },
]

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
    console.log('creating test user')
    const newUser = {
        username: 'taneli',
        name: 'tanelijormala',
        password: 'salainen',
    }
    await api
        .post('/api/user')
        .send(newUser)
        .expect(200)
    console.log('test user created')

    // login and get user token
    console.log('getting user token')
    const loginRes = await api
        .post('/api/login')
        .send({
            username: 'taneli',
            password: 'salainen'
        })
    userToken = loginRes.body.token
    console.log('user token:', userToken)


})


describe('Test blog api', () => {
    beforeEach(async () => {
        // Clear the database before each test
        await Blog.deleteMany({})
        // Add initial blogs to the database
        for (let blog of initialBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
    })
    test('blogs are returned as json', async () => {
        const res = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        console.log('response body:', res.body)

    })

    test('return json body with id field', async () => {    
        const res = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const blogs = res.body
        blogs.forEach(blog => {
            if (!blog.id) {
                throw new Error('Blog entry missing id field')
            }
        })
    })

    test('add blog succesfully', async () => {  
        const currentCount = await Blog.countDocuments({})
        console.log('current blog count:', currentCount)
        const newBlog = {
            title: 'kolmas blogi',
            author: 'kolmas kirjoittaja',
            url: 'urlurlurl',
            likes: 7,
            user: {
                username: 'testi',
                name: 'testi',
                id: new mongoose.Types.ObjectId()
            }
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(201)
        const newCount = await Blog.countDocuments({})
        console.log('new blog count:', newCount)
        if (newCount !== currentCount + 1) {
            throw new Error('Blog count did not increase after adding a new blog')
        }
    })

    test('new blog return 404 if no token', async () => {
        const newBlog = {
            title: 'notoken',
            author : 'notoken',
            url: 'notoken',
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('undefined likes set to 0', async () => {
        const newBlog = {
            title: 'neljas blogi',
            author: 'neljas kirjoittaja',
            url: 'urlurlurl',
             user: {
                username: 'testi',
                name: 'testi',
                id: new mongoose.Types.ObjectId()
            }
        }
        const res =  await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(201)

        if (res.body.likes !== 0) {
            throw new Error('Likes not set to 0 when undefined')
        }
    })

    test('missing field title or url return 400', async () => {
        const missingAuthor = {
            'title' : 'viides blogi',
            'likes' : 3
        }
        await api
            .post('/api/blogs')
            .send(missingAuthor)
            .expect(400)

        const missingTitle = {
            'author' : 'viides kirjoittaja',
            'likes' : 3
        }
        await api
            .post('/api/blogs')
            .send(missingTitle)
            .expect(400)

    })

    test('add token blot', async () => {
        const newBlog = {
            title: 'kuudes blogi',
            author: 'kuudes kirjoittaja',
            url: 'urlurlurl',
            likes: 7,
            user: {
                username: 'testi',
                name: 'testi',
                id: userToken
            }
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(201)
    })


    test('delete blog', async () => {
        //find blog with correct user token
        const blogs = await Blog.find({})
        let blog = null;
        for (let blog of blogs) {
            if (blog.user && blog.user.username === 'taneli') {
                blog = blog
                break
            }
        }
        
        if (!blog) {
            throw new Error('No blogs to delete')
        }

        await api
            .delete(`/api/blogs/${deleteId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
        const updatedBlogs = await Blog.find({})
        if (updatedBlogs.length !== blogs.length -1) {
            throw new Error('Blog not deleted')
        }
    })

    test('update blog', async () => {
        const blogs = await Blog.find({})
        const blogToUpdate = blogs[0]
        const updatedId = blogToUpdate._id.toString()
        
        const newBlogData = {
            title: 'updated title',
            author: 'updated author',
            url: 'updated url',
            likes: 42,
        }
        const res = await api
            .put(`/api/blogs/${updatedId}`)
            .send(newBlogData)
            .expect(200)
        if (res.body.title !== newBlogData.title || res.body.author !== newBlogData.author || res.body.url !== newBlogData.url || res.body.likes !== newBlogData.likes) {
            throw new Error('Blog not updated correctly')
        }

        const updatedBlog = await Blog.findById(updatedId)
        if (updatedBlog.title !== newBlogData.title || updatedBlog.author !== newBlogData.author || updatedBlog.url !== newBlogData.url || updatedBlog.likes !== newBlogData.likes) {
            throw new Error('Blog not updated in database')
        }

    })

            

})

after(async () => {
    await mongoose.connection.close()
})


