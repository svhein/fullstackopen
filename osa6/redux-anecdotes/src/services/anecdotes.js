const baseUrl = 'http://localhost:3001/anecdotes'

export const fetchAnecdotes = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  const data = await response.json()
  return data
}


export const postAnecdote = async (content) => {
  const newAnecdote = {
    content: content,
    votes: 0
  }

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAnecdote)
    })

    if (!res.ok) {
        throw new Error('failed create new anecdote')
    }

    const data = await res.json()
    console.log('post', data)
    return data

}
