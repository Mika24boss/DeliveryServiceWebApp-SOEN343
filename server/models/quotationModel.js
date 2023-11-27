const mongoose = require('mongoose');

const Quotation = new mongoose.Schema({
    quotationID: {
        type: Number
    },
    pickUpAddress: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    distance: {
        type: Number
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    price: {
        type: Number,
        required: true
    },
});
module.exports = mongoose.model('Quotation', Quotation);