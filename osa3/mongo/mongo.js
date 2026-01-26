

import mongoose from 'mongoose'

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://samppa:${password}@cluster0.0ku1vzm.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', PersonSchema)

async function addPhoneNumber(name, number) {
  const person = new Person({
    name: name,
    number: number,
  })
  const res = await person.save()
  console.log(`added ${name} number ${number} to phonebook`)
}

async function getAllPhoneNumbers() { 
  const persons = await Person.find({})
  return persons
}

const name = process.argv[3]
const number = process.argv[4]

if (name && number) {
  console.log('adding person')
  await addPhoneNumber(name, number)
} else {
  const persons = await getAllPhoneNumbers()
  console.log('phonebook:')
  persons.forEach(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
}






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
