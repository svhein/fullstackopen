

export const NewBlogForm = ({ createBlog }) => {

    return (
        <div className="newBlogForm">
            <h2>Create new</h2>
            <form onSubmit={createBlog}>
                <div>
                    title: <input id="title" />
                </div>
                <div>
                    author: <input id="author" />
                </div>
                <div>
                    url: <input id="url" />
                </div>
                <button className='createBlogButton' type="submit">create</button>
            </form>
        </div>
    )
}

