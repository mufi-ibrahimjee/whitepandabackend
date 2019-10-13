const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const carSchema = new Schema({
    vehicleNumber: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    model: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    seatingCapacity: {
        type: mongoose.Schema.Types.Number,
        default: 4,
    },
    booked: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    bookingStatus: {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        issueDate: {
            type: mongoose.Schema.Types.Date,
        },
        returnDate: {
            type: mongoose.Schema.Types.Date,
        }
    },
});

module.exports = model('car', carSchema);