const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]


const url =
  `mongodb+srv://fullstack:${password}@full-stack-open-frnny.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
  important: Boolean,
})

const Person = mongoose.model('Person', personSchema)

const AddPerson = () => {
  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to the phonebook`)
    mongoose.connection.close()
  })
}

const DisplayPhonebook = () => {
  console.log('Phonebook:')

  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  AddPerson()
} else if (process.argv.length < 5) {
  DisplayPhonebook()
}