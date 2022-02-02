const mongoose = require('mongoose')

const argvLength = process.argv.length

if (argvLength < 3) {
    console.log('Please provide the required arguments: node mongo.js <password> [<name> <number>]')
    process.exit(1)
} else {
    const password = process.argv[2]

    const url =
        `mongodb+srv://majabaza:${password}@cluster0.k9dqp.mongodb.net/person-app?retryWrites=true&w=majority`
    mongoose.connect(url)

    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })
    const Person = mongoose.model('Person', personSchema)
    
    if (argvLength === 3) {
        Person
            .find({})
            .then(result => {
                result.forEach(person => {
                    console.log(person)
                })
            mongoose.connection.close()
        })
    }
    else {
        const name = process.argv[3]
        const number = (process.argv.length > 4) ? process.argv[4] : ''

        const person = new Person({
            name,
            number,
        })
          
        person.save().then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
    }
}