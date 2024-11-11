const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    jobdes: String,
    resume: String,
    percentage: String,
});

module.exports = mongoose.model('User', userSchema);