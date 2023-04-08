import mongoose from 'mongoose';

const {Schema} = mongoose;
const userSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        required: true,
        unique: false,
    },
    userId: {
        type: String,
        required: true,
        unique: false,
    }
});

module.exports = mongoose.model('User', userSchema);