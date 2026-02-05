import React from 'react';
import { useSelector } from 'react-redux';



export const AnecdoteList = ({ anecdotes, vote }) => {
  

    const filter = useSelector(state => state.filter);

    if (filter) {
      const filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()));
      anecdotes = filteredAnecdotes
    }

    return (
        <React.Fragment>
        {anecdotes.map(anecdote => {

          return (
            (
              <div key={anecdote.id}>
                <div>{anecdote.content}</div>
                <div>
                  has {anecdote.votes}
                  <button onClick={() => vote(anecdote.id)}>vote</button>
                </div>
              </div>
              
            )
            )

        })}
      </React.Fragment>
    )
}