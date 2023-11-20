const mongoose = require('mongoose')

const Item = new mongoose.Schema({
    name: {
        type: String
    },
    quantity: {
        type: Number
    },
})
module.exports = mongoose.model('Item', Item)