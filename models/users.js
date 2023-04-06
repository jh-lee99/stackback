import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userEmail: String,
  password: String,
  userid: String
});

const User = mongoose.model('User', userSchema);
export default User;