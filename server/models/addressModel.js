const mongoose = require('mongoose')

const Address = new mongoose.Schema({
    street: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    province: {
        type: String
    },
    country: {
        type: String,
    },
    postalCode: {
        type: String,
    }
})
module.exports = mongoose.model('Address', Address)