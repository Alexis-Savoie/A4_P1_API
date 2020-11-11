
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const Itinerary = new Schema({

    coordinate: {
        index: true,
        type: String,
        required: true,
    },

    itineraryName: {
        trim: true,
        index: true,
        type: String,
        required: true,
    },

    emailUser: {
        trim: true,
        index: true,
        type: String,
        required: true,
        lowercase: true,
    },

}, { timestamps: true })

module.exports = mongoose.model('itinerary', Itinerary); 
