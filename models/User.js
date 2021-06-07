const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema


const User = mongoose.model('User', userSchema);
module.exports = User
