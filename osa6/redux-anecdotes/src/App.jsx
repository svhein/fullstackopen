import { useDispatch, useSelector } from 'react-redux'
import { AnecdoteForm } from './components/AnecdoteForm'
import { AnecdoteList } from './components/AnecdoteList'
import { setAnecdotes, sortAnecdotes, voteAnecdote } from './reducers/anecdoteReducer'
import { Filter } from './components/Filter'
import { Notification } from './components/Notification'
import { useEffect } from 'react'
import { fetchAnecdotes } from './services/anecdotes'

const App = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const notificationState = useSelector(state => state.notification)

  console.log('redux state:', useSelector(state => state))

  const dispatch = useDispatch()

  useEffect(() => {
    const init = async () => {
      const res = await fetchAnecdotes()
      dispatch(setAnecdotes(res))
      dispatch(sortAnecdotes())
    }
    init()
  }, [])

  const vote = id => {
    dispatch(voteAnecdote(id))
    dispatch(sortAnecdotes())
  }

  return (
    <div>
      <h2>Anecdotes</h2>

      {notificationState && <Notification />}

      <Filter />
      <AnecdoteList anecdotes={anecdotes} vote={vote} />
      <AnecdoteForm />
      
    </div>
  )
}

export default App
