const mongoose = require('mongoose');

const ClientOrderJoin = mongoose.Schema({
    clientID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    orderID: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    location: {
        type: String
    },
    arrivalEstimatedTime: {
        type: Date,
        required: true,
    }
});