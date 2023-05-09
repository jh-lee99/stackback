import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
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

export const User = mongoose.model('user', userSchema);

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Database connected!');
  } catch (err) {
    console.error('Error connecting to database:', err);
  }
}

// DB에 유저 정보 추가
export const addUser = async (userData) => {
  const { username, email, password } = userData;

  // 이미 존재하는 이메일인지 확인
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // 새로운 유저 생성
  const newUser = new User({
    username,
    email,
    password,
    joined: Date.now() // 가입한 일자 추가
  });

  // 유저 저장 및 반환
  return newUser.save()
    .then(addedUser => addedUser)
    .catch(err => {
      throw err;
    }); 
};

export const getUserData = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
    throw new Error('Error while getting user data from DB');
  }
};

// email과 password가 일치하는 사용자를 찾아 email과 password를 수정하는 함수
export const updateUserByEmailAndPassword = (email, password, newEmail, newPassword, callback) => {
  // email과 password가 일치하는 사용자를 찾아서 email과 password를 수정
  User.findOneAndUpdate(
    { email: email, password: password }, // 일치하는 조건
    { email: newEmail, password: newPassword }, // 수정할 값
    { new: true }, // 수정된 문서 반환
    (err, updatedUser) => {
      if (err) {
        // 에러 발생 시 콜백 함수 호출
        callback(err, null);
      } else {
        // 수정된 사용자 정보 반환
        callback(null, updatedUser);
      }
    }
  );
};

export default [
  {
      username : 'admin',
      email : 'admin',
      password : 'admin'
  },
]