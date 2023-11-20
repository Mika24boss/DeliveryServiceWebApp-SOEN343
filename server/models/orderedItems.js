const mongoose = require('mongoose')

const OrderItems = new mongoose.Schema({
    items: [{
        type: mongoose.Schema.Types.ObjectId
    }]
})
module.exports = mongoose.model('OrderedItems', OrderItems)