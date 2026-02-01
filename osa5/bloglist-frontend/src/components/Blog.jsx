import React, { useState } from 'react'

export const Blog = ({ blog }) => {

  console.log('Blog component', blog)

  const [showAll, setShowAll] = useState(false);
  const [likes, setLikes] = useState(blog.likes ?? 0);

  const handleLike = async () => {

    const res=  await fetch(`http://localhost:3003/api/blogs/${blog.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...blog,
        likes: likes + 1,
      })
    })

    if (res.ok) {
      console.log('like updated')
      setLikes(likes + 1)
    }
  }

  if (showAll) {
    return (
      <div>
        <div>
          {blog.title} by {blog.author}
        </div>
           <button onClick={() => setShowAll(false)}>hide</button>
        <div>
          <div>{blog.url}</div>
          <div>likes {likes} <button className='likeButton' onClick={handleLike}>like</button></div>
          {blog.user && <div>by {blog.user.name}</div>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <p class='title-author'>
    {blog.title} by {blog.author}
      </p>
      <div>
         <button class='showAllButton' onClick={() => setShowAll(true)}>view</button>
      </div>
    </div>
  )
}
