const {Schema, model} = require("mongoose")
const Counter = require('../models/Counter')

const schema = new Schema ({
    email: { type: String , required: true, unique: true },
    password: { type: String, required: true },
    userId: { type: Number, required: true },
})

module.exports = model('User', schema)