const mongoose = require('mongoose');

const Person = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    loginInfo: {
        type: String,
        required: [true, 'Please add an email']
    },
});

module.exports = mongoose.model('Person', Person);