const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('Please provide all the arguments as required.')
    console.log('Correct usage: node mongo.js <password> <name> <phonenumber')
    process.exit(1)
}

const [ , , password, name, number ] = process.argv

const url =
    `mongodb+srv://majabaza:${password}@cluster0.k9dqp.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url)