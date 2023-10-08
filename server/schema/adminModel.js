const mongoose = require('mongoose');

const role = Object.freeze(["HR-ADMIN", "TECHNOLOGY-ADMIN", "FINANCE-ADMIN", "GENERAL-ADMIN"])

const Admin = new Schema({
    role: {
        type: String,
        trim: true,
        enum: role,
        required: true,
        default: "GENERAL-ADMIN",
    },
});

const AdminSignUp = Person.discriminator("admin", Admin)

module.exports = { AdminSignUp }