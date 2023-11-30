const mongoose = require('mongoose')
const status = Object.freeze(["PICKUP", "DELIVERING", "DELIVERED", "PAID"])

const Order = new mongoose.Schema({
    orderID: {
        type: Number
    },
    orderDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: status,
        trim: true,
        default: "PAID",
    },
    pickUpDate: {
        type: Date,
        required: true,
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    orderItems: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderedItems'
    }
});
module.exports = mongoose.model('Order', Order)