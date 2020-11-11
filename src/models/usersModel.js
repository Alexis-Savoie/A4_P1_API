
const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const Users = new Schema({
    email: {
        trim: true,
        index: true,
        type: String,
        required: true,
        lowercase: true,
    },

    password: {
        index: true,
        type: String,
        required: true,
    },

    temporary_password: {
        index: true,
        type: String,
    },

}, { timestamps: true })



module.exports = mongoose.model('users', Users); 