require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('sent', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :sent'))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

const generateID = () => {
    const newRandom = Math.floor(Math.random() * 4400)

    if (persons
        .map(person => person.id)
        .includes(newRandom)) {
        return generateID()
    } else {
        return newRandom
    }
}

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.estimatedDocumentCount().then(result => {
        response.send(`Phonebook has info for ${result} people<br><br>${Date()}`)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: 'Some information (name or number) missing'
        })
        .catch(error => next(error))
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})