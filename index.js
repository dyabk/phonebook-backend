require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('sent', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :sent'))

app.get('/', (request, response) => {
    response.send('<h1>Phonebook app</h1>')
})

app.get('/info', (request, response) => {
    Person.estimatedDocumentCount().then(result => {
        response.send(`Phonebook has info for ${result} people<br><br>${Date()}`)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        fullName: body.fullName,
        number: body.number
    })

    if(!body.fullName && !body.number) {
        return response.status(400)
        .json({
            error: 'Adding an empty record is not allowed.'
        })
    } else if(!body.fullName) {
        return response.status(400)
        .json({
            error: 'Adding a record without a name is not allowed.'
        })
    } else if(!body.number) {
        return response.status(400)
        .json({
            error: 'Adding a record without a number is not allowed.'
        })
    }

    Person.find( {fullName: body.fullName}, (error, result) => {
        if (result !== null) {
            if (error) {
                return response.status(400)
                .json({
                    error: `${body.fullName} is already added to the phonebook.`
                })
            }
        }
    })
    
    person.save()
        .then(savedPerson => {
            console.log('Person saved: ', person)
            response.json(savedPerson)
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
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

app.put('/api/persons/:id', (request, response, next) => {
    const { fullName, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { fullName, number },
        { new: true })
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
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})