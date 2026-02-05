import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNewAnecdote } from '../reducers/anecdoteReducer'
import { postAnecdote } from '../services/anecdotes'

export const AnecdoteForm = () => {

    const [text, setText] = useState('')
    const dispatch = useDispatch()

    const addAnecdote = async (e) => {
        if (text != undefined) {
            const newAnecdote = await postAnecdote(text)
            dispatch(createNewAnecdote(newAnecdote))
        }
    }
        


    return (
    <React.Fragment>
        <h2>create new</h2>
        {/* <form> */}
            <div>
            <input onChange={(e) => {
                e.preventDefault()
                setText(e.target.value)
            }} />
            </div>
            <button onClick={async () => {
                await addAnecdote()
            }}>create</button>
        {/* </form> */}
    </React.Fragment>
    )
}