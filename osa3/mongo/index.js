require('dotenv').config()
const express = require('express')
const Person = require('./modules/person')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

app.get('/api/persons', async (req, res, next) => {
    try{
        console.log('get /api/persons')
        const persons = await Person.find({})
        res.json(persons)

    }
    catch(error){
        next(error)
    }
})

app.post('/api/persons', async (req, res, next) => {
    try{
        console.log('post /api/persons')
        const { name, number } = req.body

        if (!name || !number){
            return res.status(400).json({
                error: 'name or number missing'
            })
        }

        const existingPerson = await Person.findOne({ name: name })
        if (existingPerson){
            existingPerson.number = number
            const updatedPerson = await existingPerson.save()
            return res.json(updatedPerson)
        }

        else {
        const person = new Person({
            name: name,
            number: number,
        })
        const savedPerson = await person.save()
        return res.json(savedPerson)
        }

   
    }
    catch(error){
        next(error)
    }
})

app.delete('/api/persons/:id', async (req, res, next) => {
    try{
        const id = req.params.id
        console.log(`delete /api/persons/${id}`)
        await Person.findByIdAndRemove(id)
        res.status(200).end()
    }
    catch(error){
        next(error)
    }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
    if (error.name === 'ValidationError') {
     return response.status(400).json({ error: error.message })
 }

  res.status(500).end()
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})