import React, { useState, useEffect } from 'react'
import { login } from './services/login'
import { NewBlogForm } from './components/NewBlogForm'
import { Blog } from './components/Blog'
// import Note from './components/Note'
// import Notification from './components/Notification'
// import noteService from './services/notes'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [successMessage, setSuccessMessage] = useState(null)
  const [failureMessage, setFailureMessage] = useState(null)
  const [loginFailureMessage, setLoginFailureMessage] = useState(null)

  const [showBlogForm, setShowBlogForm] = useState(false)

  // useEffect(() => {
  //   noteService.getAll().then(initialNotes => {
  //     setNotes(initialNotes)
  //   })
  // }, [])

  useEffect(() => {
    // check if user in storage
    const init = async () => {
      const loggedUser = window.localStorage.getItem('loggedUser')
      if (loggedUser) {
        const user = JSON.parse(loggedUser)
        setUser(user)

        // fetch blogs
        const res = await fetch('http://localhost:3003/api/blogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        })
        const blogs = await res.json()
        setBlogs(blogs)
      }
    }
    init()
  }, [])

  const addNewBlog = async (event) => {
    setSuccessMessage(null)
    setFailureMessage(null)
    event.preventDefault()
    const author = event.target.author.value
    const title = event.target.title.value
    const url = event.target.url.value


    console.log('new blog:', author, title, url)

    try{
      const res = await fetch('http://localhost:3003/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ author, title, url })
      })
      if (!res.ok) {
        setFailureMessage(`Failed to create blog: ${res.status} ${res.statusText}`)
        throw new Error(`Failed to create blog: ${res.status} ${res.statusText}`)
      }
      const createdBlog = await res.json()

      setBlogs(blogs.concat(createdBlog))
      setSuccessMessage(`added blog '${createdBlog.title}' by ${createdBlog.author}`)

    }
    catch (error) {
      console.error('Error creating blog:', error)
    }

  }

  // const toggleImportanceOf = id => {
  //   const note = notes.find(n => n.id === id)
  //   const changedNote = { ...note, important: !note.important }

  //   noteService
  //     .update(id, changedNote)
  //     .then(returnedNote => {
  //       setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
  //     })
  //     .catch(() => {
  //       setErrorMessage(
  //         `Note '${note.content}' was already removed from server`
  //       )
  //       setTimeout(() => {
  //         setErrorMessage(null)
  //       }, 5000)
  //       setNotes(notes.filter(n => n.id !== id))
  //     })
  // }

   const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await login({ username, password })
      console.log('logged in user:', user)
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
    } catch {
      setLoginFailureMessage('wrong username or password')
      setTimeout(() => {
        setLoginFailureMessage(null)
      }, 5000)
    }
  }


  return (
    <div>
      <h1>Blogs</h1>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {failureMessage && <div style={{ color: 'red' }}>{failureMessage}</div>}
      {loginFailureMessage && <div style={{ color: 'red' }}>{loginFailureMessage}</div>}
      {/* <Notification message={errorMessage} /> */}

      {!user &&
      <React.Fragment>
      <h2>Login</h2>
      <form className='loginForm' onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button className='loginButton' type="submit">login</button>
      </form>
      </React.Fragment>
      }

      {user && <p>{user.username} logged in</p>}
      {user &&
      <button onClick={(e) => {
          e.preventDefault()
        setUser(null)
        window.localStorage.removeItem('loggedUser')
      }}>
        logout
      </button>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <button className='showBlogsButton' onClick={() => setShowBlogForm(!showBlogForm)}>
        {showBlogForm ? 'cancel' : 'new blog'}
      </button>
      {showBlogForm && <NewBlogForm createBlog={addNewBlog} />}



      {blogs.sort((a,b) => a.likes < b.likes).map(blog => (
        <Blog blog={blog} />
      ))}

    </div>
  )
}

export default App