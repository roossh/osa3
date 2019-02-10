if (process.env.NODE_ENB !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())

app.use(cors())

morgan.token('post', function (req) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :response-time ms :post', {
  skip: function (req) { return req.method !== 'POST'}
}))

app.use(morgan('tiny', {
  skip: function (req) {return req.method === 'POST'}
}))

app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (req, res) => {
  let len
  Person.find().countDocuments({}, (error, data) => {
    len = data
    const info = `<p>Puhelinluettelossa ${len} henkilön tiedot</p><p>${new Date().toLocaleString()}</p>`
    res.send(info)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(204).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const personObject =  new Person({
    name: body.name,
    number: body.number
  })

  personObject.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})