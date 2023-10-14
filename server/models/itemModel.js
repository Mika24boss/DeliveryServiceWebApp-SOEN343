const mongoose = require('mongoose')

const Item = new mongoose.Schema({
    name: {
        type: String
    },
    isFragile: {
        type: Boolean
    },
    price: {
        type: Number
    }
})
module.exports = mongoose.model('Item', Item)