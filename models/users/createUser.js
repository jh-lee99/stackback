import { Schema, model } from 'mongoose';
import createUser from '../../models/users/createUser'

const userSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

const User = model('User', userSchema);

const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.validate(); // validate input against schema
    await user.save();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createUser;