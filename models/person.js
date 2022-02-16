const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => console.log('connected to Mongo'))
    .catch(error => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
    fullName: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 1,
        required: true,
        validate: {
            validator: value => /^(\d{3}[- ]){1,2}\d{4}?$/.test(value),
            message: props => `${props.value} is not a valid phone number!`
        }
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