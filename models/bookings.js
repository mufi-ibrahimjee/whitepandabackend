const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookingSchema = new Schema({
    carId: {
        type: mongoose.Schema.Types.String
    },
    issueDate: {
        type: mongoose.Schema.Types.Date
    },
    endDate: {
        type: mongoose.Schema.Types.Date
    }
});

module.exports = model('booking', bookingSchema);