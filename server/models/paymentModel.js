const mongoose = require('mongoose')

const methodOfPayment = Object.freeze(["CASH", "CREDIT", "NONE"])

const Payment = new mongoose.Schema({
    methodOfPayment: {
        type: String,
        trim: true,
        enum: methodOfPayment,
        required: true,
        default: "NONE",
    },
    dateOfPayment: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        require: true,
    }
})
module.exports = mongoose.model('Payment', Payment);