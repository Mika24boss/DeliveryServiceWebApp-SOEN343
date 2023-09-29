const mongoose = require('mongoose');

const role = Object.freeze(["GOLD-CLIENT", "SILVER-CLIENT", "BRONZE-CLIENT", "REGULAR-CLIENT"])

const Client = new Schema({
    role: {
        type: String,
        trim: true,
        enum: role,
        required: true,
        default: "REGULAR-CLIENT",
    },
    quotations: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Quotation'
    }],
    order: [{
        type: mongoose.Schema.type.ObjectId,
        required: true,
        ref: 'Order'
    }],
});

const ClientSignUp = Person.discriminator("client", Client)

module.exports = { AdminSignUp }