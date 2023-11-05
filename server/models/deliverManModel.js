const mongoose = require('mongoose');
const Person = require('./personModel')
const role = Object.freeze(["PICKUP-MAN", "DELIVERY-MAN"])

const DeliveryMan = new mongoose.Schema({
    role: {
        type: String,
        trim: true,
        enum: role,
        required: true,
        default: "DELIVERY-MAN",
    },
    numberOfOrder: {
        type: Number
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId
    }]
});

module.exports = Person.discriminator("DeliveryMan", DeliveryMan)