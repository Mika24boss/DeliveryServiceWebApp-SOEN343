const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Person = require('./personModel')
const role = Object.freeze(["ADMIN"])

const Admin = new Schema({
    role: {
        type: String,
        trim: true,
        enum: role,
        required: true,
        default: "ADMIN",
    },
});

module.exports = Person.discriminator("Admin", Admin)