const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const password = process.env.MONGODB_PW
const url = `mongodb+srv://fullstack:${password}@full-stack-open-frnny.mongodb.net/phonebook-app?retryWrites=true&w=majority`


console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
    important: Boolean,
  })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)