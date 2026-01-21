import React, { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad


  return (
    <div>
      <h1>Anna palautetta</h1>
      <button onClick={() => setGood(good + 1)}>hyvä</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutraali</button>
      <button onClick={() => setBad(bad + 1)}>huono</button>
      <h1>Statiikka</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}


const Statistics = (props) => {

  const { good, neutral, bad } = props
  const total = good + neutral + bad

  if (total === 0) {  
    return (
      <div>ei yhtään palautetta annettu</div>
    )
  }

  return (
    <React.Fragment>
      <table>
        <tbody>
          <tr>
            <td>hyvä</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>neutraali</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>huono</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>yhteensä</td>
            <td>{total}</td>
          </tr>
          <tr>
            <td>keskiarvo</td>
            <td>{((good - bad) / total).toFixed(2)}</td>
          </tr>
          <tr>
            <td>positiivisia</td>
            <td>{((good / total) * 100).toFixed(2)} %</td>
          </tr>
          
        </tbody>
      </table>
      
    </React.Fragment>
  )


}

export default App