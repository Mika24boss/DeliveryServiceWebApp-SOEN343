const mongoose = require('mongoose');

const ClientOrderJoin = new mongoose.Schema({
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
module.exports = mongoose.model('ClientOrderJoin', ClientOrderJoin)