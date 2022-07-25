const {Schema, model} = require("mongoose")

const schema = new Schema ({
    idCounter: { type: Number, required: true, default: 1 },
    name: { type: String, required: true, default: 'default' }
})

module.exports = model('Counter', schema)