import { useState, useEffect } from 'react'
import { Filter } from './Filter'
import { PersonList } from './PersonList'
import { PersonForm } from './PersonForm'
import axios from 'axios'
import { create, update } from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorText, setErrorText] = useState(null)

  useEffect(() => {

    console.log('fetching data');
    const fetchData = async () => {
      const response = await axios.get('/api/persons')
      setPersons(response.data)
      console.log('data fetched');
    }
    fetchData()

  }, [])


  const handleNewName = (event) => {
    event.preventDefault()
    setNewName(event.target.value)

  }

  const addNewPerson = async () => {

    setErrorText(null)
    const exists = persons.find(person => person.name === newName)

    if (exists){
        update(exists.id, {name: newName, number: newNumber})
        alert(`${newName} info updated`)
        setPersons(persons.map(person => person.id === exists.id ? {name: newName, number: newNumber} : person))
        setNewName('')
        return
    }

    const res = await create({name: newName, number: newNumber})
    
    if (res.success){
        setPersons(persons.concat(res.data))
        setNewName('')
    }
    else {
        console.log('Failed to add new person')
        setErrorText(res.data)
    }
    


  }

  return (
    <div>
      <h2>Phonebook</h2>

      {errorText &&
        <div style={{border: '2px solid red', padding: '10px', marginBottom: '10px'}}>
          <p style={{color: 'red'}}>{errorText}</p>
        </div>
      }

      <form>

        <h3>search name</h3>
        <Filter 
        filter={filter}
        onChange={(event) => setFilter(event.target.value)}
        />

        <h3>add a new</h3>
        <PersonForm
        addNewPerson={addNewPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        ></PersonForm>
      </form>
      <h2>Numbers</h2>
      
      <PersonList persons={persons} setPersons={setPersons} filter={filter}></PersonList>

      ...
    </div>
  )

}

export default App