const mongoose = require('mongoose')
const status = Object.freeze(["PICKUP", "DELIVERING", "DELIVERED", "NONE"])

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
        required: true,
        default: "NONE",
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod'
    },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId
    }]
});
module.exports = mongoose.model('Order', Order)