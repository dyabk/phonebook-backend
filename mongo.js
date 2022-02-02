const mongoose = require('mongoose')

if (process.argv.length < 5) {
    console.log('Please provide all the arguments as required.')
    console.log('Correct usage: node mongo.js <password> <name> <phonenumber')
    process.exit(1)
}