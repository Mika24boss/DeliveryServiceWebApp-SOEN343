const mongoose = require('mongoose');

const baseOption = {
    discriminatorKey: "user",
    collection: "user",
    timestamps: true
}

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
        type: Number,
        required: true,
        unique: true,
    },
    loginInfo: {
        type: String,
        required: [true, 'Please add an email']
    },
    baseOption
});

module.exports.Person = mongoose.model('Person', Person);