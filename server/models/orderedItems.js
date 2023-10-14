const mongoose = require('mongoose')

const OrderItems = new mongoose.Schema({
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
module.exports = mongoose.exports('OrderItems', OrderItems)