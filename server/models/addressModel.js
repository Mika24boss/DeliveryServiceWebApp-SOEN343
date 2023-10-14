const mongoose = require('mongoose')

const Address = mongoose.Schema({
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
module.exports = mongoose.exports('Address', Address)