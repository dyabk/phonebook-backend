const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => console.log('connected to Mongo'))
    .catch(error => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
    fullName: {
        minLength: 3,
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person