const mongoose = require('mongoose');
const Person = require('./personModel')

const role = Object.freeze(["GOLD-CLIENT", "REGULAR_CLIENT"])

const Client = new mongoose.Schema({
    role: {
        type: String,
        trim: true,
        enum: role,
        required: true,
        default: "REGULAR_CLIENT",
    },
    quotations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quotation'
    }],
    order: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
});

module.exports = Person.discriminator("Client", Client)