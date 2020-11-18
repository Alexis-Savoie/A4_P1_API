
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

    token: {
        index: true,
        type: String,
    },

    temporary_password: {
        index: true,
        type: String,
    },

    nbTry: {
        index: true,
        type: Number,
        default: 0
    },

    cooldownDate: {
        index: true,
        type: Date,
        default: Date.parse('01 Jan 1970 00:00:00')
    },

}, { timestamps: true })



module.exports = mongoose.model('users', Users); 