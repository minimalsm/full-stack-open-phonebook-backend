const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
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
    name: {
      type: String,
      minlength: 2,
      required: true,
      unique: true,
    },
    number: {
      type: Number,
      required: true
    },
    important: Boolean,
  })
  personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)