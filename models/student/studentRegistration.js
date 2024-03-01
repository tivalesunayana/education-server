
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const studentRegistrationSchema = new Schema({
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    previousEducation: { type: String, required: true },
    programOfInterest: { type: String, required: true },
    country: { type: String, require: true },
    state: { type: String, require: true },
    city: { type: String, require: true },
    languageProficiency: {
        marathi: { type: Boolean, required: true },
        hindi: { type: Boolean, required: true },
        english: { type: Boolean, required: true },
    },

    consent: { type: Boolean, required: true },
});
const StudentRegistration = mongoose.model('StudentRegistration', studentRegistrationSchema);

module.exports = StudentRegistration;