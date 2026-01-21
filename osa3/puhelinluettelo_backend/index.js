
const persons = 
    [{ 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }]
  

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :response-time ms :body')
)

console.log('puhelinluettelo backend')

app.get('/info', (req, res) => {
  try{
    console.log('GET /info')
    const phoneBookSize = persons.length
    const currentTime = new Date()
    res.send(`
      <div>
        <p>Phonebook has info for ${phoneBookSize} people</p>
        <p>${currentTime}</p>
      </div>
      `)
  }
  catch(error){
    console.log(error)
    res.status(500).end()
  }
})

app.get('/api/persons', (req, res) => {
  try{
    console.log('GET /api/persons')
    res.json(persons)
  }
  catch(error){
    console.log(error)
    res.status(500).end()
  }
})

app.get('/api/persons/:id', (req, res) => {
  try{
    const id = Number(req.params.id)
    console.log(`GET /api/persons/${id}`)
    const person = persons.find(person => person.id === id)
    if (person){
      res.json(person)
    } else {
      res.status(404).end()
    }
  }
  catch(error){
    console.log(error)
    res.status(500).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  try{
    const id = Number(req.params.id)
    console.log(`DELETE /api/persons/${id}`)
    const idx = persons.findIndex(person => person.id === id)
    if (idx === -1){
      res.status(404).end()
    }
    persons.splice(idx, 1)
    res.status(200).end()
  }
  catch(error){
    console.log(error)
    res.status(500).end()
  }
})

app.post('/api/persons', (req, res) => {
  try{
    console.log('POST /api/persons')
    const { name, number } = req.body
    if (!name || !number){
      return res.status(400).json({
        error: 'name or number is missing'
      })
    }

    if (persons.find(person => person.name === name)){
      return  res.status(400).json({
        error: 'name must be unique'
      })
    }
    
    const id = Math.floor(Math.random() * 10000)
    const newPerson = {
      name: name,
      number: number,
      id: id
    }
    persons.push(newPerson)
    res.status(201).json(newPerson)
  }
  catch(error){
    console.log(error)
    res.status(500).end()
  }
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


