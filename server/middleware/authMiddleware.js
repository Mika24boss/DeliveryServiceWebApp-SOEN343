const jwt = require('jsonwebtoken');
const Person = require('../models/personModel')
const {decode} = require("jsonwebtoken");
module.exports = (context) => {
    // context = { ... headers }
    if (context) {
        // Bearer ....
        const token = context.split('Bearer ')[1];
        if (token) {
            try {
                return jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                throw new Error('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};