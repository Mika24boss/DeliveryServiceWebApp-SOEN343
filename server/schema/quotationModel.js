const mongoose = require('mongoose');

const Quotation = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    billingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Address'
    },
    price: {
        type: Number,
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
});
module.exports.Quotation = mongoose.model('Quotation', Quotation);