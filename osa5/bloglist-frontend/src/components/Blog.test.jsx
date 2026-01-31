import React from 'react'
import { render, screen } from '@testing-library/react'
import { Blog } from './Blog'
import userEvent from '@testing-library/user-event'

test('render blog title', () => {
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

    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.title-author')
    expect(div).toHaveTextContent('Maisteluni by Mjölnir')
})

test('render url, likes on show all button press', async () => {

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

    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()

    const button = container.querySelector('.showAllButton')
    await user.click(button)

     screen.debug()

    expect(screen.getByText('http://example.com/taisteluni')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
    expect(screen.getByText('by taneli')).toBeDefined()


})