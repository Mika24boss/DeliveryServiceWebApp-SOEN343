const mongoose = require('mongoose')

const Item = mongoose.Schema({
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