const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    students_id: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    room_number: {
        type: String
    },
    course: {
        type: String
    },
    year: {
        type: String
    },
    guardian_name: {
        type: String
    },
    guardian_phone: {
        type: String
    },
    amount_paid: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
