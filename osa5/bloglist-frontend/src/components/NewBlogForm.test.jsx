import React from 'react'
import { render, screen } from '@testing-library/react'
import { Blog } from './Blog'
import userEvent from '@testing-library/user-event'
import { NewBlogForm } from './NewBlogForm'

test('test new blog callback', async () => {

    const blog = {
        title: 'Maisteluni',
        author: 'Mjölnir',
        url: 'http://example.com/taisteluni',
        likes: 5,
        user: {
            name: 'taneli',
            username: 'taneli'
        }
    }     

    const createBlog = vi.fn()

    const { container } = render(<NewBlogForm createBlog={createBlog} />)

    const authorInput = container.querySelector('#author')
    const titleInput = container.querySelector('#title')
    const urlInput = container.querySelector('#url')

    const user = userEvent.setup()

    await user.type(authorInput, blog.author)
    await user.type(titleInput, blog.title)
    await user.type(urlInput, blog.url)

    const submitButton = screen.getByText('create') 
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)


})
