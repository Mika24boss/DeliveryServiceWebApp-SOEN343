const mongoose = require('mongoose')

const methodOfPayment = Object.freeze(["CASH", "CREDIT", "NONE"])

const PaymentMethod = new mongoose.Schema({
    methodOfPayment: {
        type: String,
        trim: true,
        enum: methodOfPayment,
        required: true,
        default: "NONE",
    },
    dateOfPayment: {

    },
    amount: {
        type: Number,
        require: true,
    }
})
module.exports = mongoose.model('PaymentMethod', PaymentMethod);