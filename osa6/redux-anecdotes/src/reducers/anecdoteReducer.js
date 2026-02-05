import { useDispatch, useSelector } from "react-redux"
import { createSlice } from "@reduxjs/toolkit"
import { fetchAnecdotes } from "../services/anecdotes"

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)


const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}


// const createNewAnecdote = content => {
//   return {
//     type: 'CREATE_NEW',
//     payload: {
//       content: content
//     }
//   }
// }

// const voteAnecdote = id => {
//   return {
//     type: 'VOTE',
//     payload: {
//       id: id
//     }
//   }
// }

// const sortAnecdotes = () => {
//   return {
//     type: 'SORT'
//   }
// }


// const initialState = anecdotesAtStart.map(asObject)

// const anecdoteReducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)

//   switch (action.type) {
//     case 'VOTE':
//       const id = action.payload.id
//       const a = state.find(n => n.id === id)
//       const votedAnecdote = {
//         ...a,
//         votes: a.votes + 1
//       }
//       return state.map(a => a.id !== id ? a : votedAnecdote)
    
//     case 'CREATE_NEW' : 
//       const content = action.payload.content
//       const newAnecdote = {
//         content: content,
//         id: getId(),
//         votes: 0
//       }
//       return [...state, newAnecdote]

//     case 'SORT':
//       return [...state].sort((a, b) => b.votes - a.votes)
    

//     default:
//       return state
//   }
// }

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createNewAnecdote(state, action) {
      console.log('creating new ancecote', action.payload)
      const content = action.payload
      const newAnecdote = {
        content: content.content,
        id: getId(),
        votes: 0
      }
      state.push(newAnecdote)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const a = state.find(n => n.id === id)
      const votedAnecdote = {
        ...a,
        votes: a.votes + 1
      }
      return state.map(a => a.id !== id ? a : votedAnecdote)
    },
    sortAnecdotes(state) {
      return [...state].sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})


export const initAnecdotes = () => {
  return async (dispatch) => {
    const res = await fetchAnecdotes()
    dispatch(setAnecdotes(res))
    dispatch(sortAnecdotes())
  }
}

export const postAnecdote = (content) => {
  const newAnecdote = {
    content: content,
    votes: 0
  }

  return async (dispatch) => {
    const res = await fetch('http://localhost:3001/anecdotes', {
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
    dispatch(createNewAnecdote(data))
    dispatch(sortAnecdotes())

  }
} 

const { createNewAnecdote, voteAnecdote, sortAnecdotes, setAnecdotes } = anecdoteSlice.actions
const anecdoteReducer = anecdoteSlice.reducer

export { anecdoteReducer, createNewAnecdote, voteAnecdote, sortAnecdotes, setAnecdotes }
