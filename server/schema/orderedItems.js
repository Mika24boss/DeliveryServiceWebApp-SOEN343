const mongoose = require('mongoose')

const OrderItems = mongoose.Schema({
    size: {
        type: String
    },
    quantity: {
        type: Number
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId
    }]
})