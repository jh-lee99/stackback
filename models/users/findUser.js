import { Schema, model } from 'mongoose';

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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = model('User', userSchema);

const findUser = async (userData) => {
  try {
    const { email, password } = userData;
    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'User not found' };
    }
    const isMatch = await user.comparePassword(password); // compare password
    if (!isMatch) {
      return { error: 'Incorrect password' };
    }
    return { user };
  } catch (error) {
    console.error(error);
    return { error: 'Login failed' };
  }
};

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

export default findUser;