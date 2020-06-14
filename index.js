const express = require('express')
const app = express()
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token("post-body", function(req) {
  return JSON.stringify(req.body);
});


app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), 
      '-',
      tokens['response-time'](req, res), 
      'ms',
      tokens["post-body"](req, res),
    ].join(' ')
  })
)

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${Date(Date.now())}<p>
    `)
  })
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(204).end()
      }
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})