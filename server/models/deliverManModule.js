const mongoose = require('mongoose');
const Person = require('./personModel')
const role = Object.freeze(["PICKUP-MAN", "DELIVERY-MAN", "DROPOFF-MAN"])

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

const DeliveryManSignUp = Person.discriminator("deliveryMan", DeliveryMan)

module.exports = { DeliveryManSignUp }