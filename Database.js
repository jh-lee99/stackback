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

const messageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageID: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// 각 유저의 첫 번째 메시지를 저장할 때마다 messageID 값을 자동으로 증가시킴
messageSchema.pre('save', async function (next) {
  const maxMessageCount = 5; // 유저가 저장할 수 있는 최대 메시지 개수

  // 현재 유저의 메시지 개수를 확인
  const messageCount = await this.constructor.countDocuments({ username: this.username });

  if (messageCount >= maxMessageCount) {
    // 메시지 개수가 최대 개수 이상인 경우 가장 오래된 메시지를 삭제
    const oldestMessage = await this.constructor.findOneAndDelete({ username: this.username }, { sort: { messageID: 1 } });

    // 삭제된 메시지보다 messageID가 큰 메시지들의 ID를 1씩 감소시킴
    await this.constructor.updateMany(
      { username: this.username, messageID: { $gt: oldestMessage.messageID } },
      { $inc: { messageID: -1 } }
    );

    this.messageID = maxMessageCount; // 새로운 메시지의 ID를 최대 개수로 설정
  } else {
    // 메시지 개수가 최대 개수 미만인 경우 ID를 증가시킴
    const existingMessages = await this.constructor.find({ username: this.username }).sort({ messageID: -1 }).limit(1);
    if (existingMessages.length > 0) {
      this.messageID = existingMessages[0].messageID + 1;
    } else {
      this.messageID = 1;
    }
  }
  next();
});

messageSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  const username = update.$set.username;
  if (username) {
    try {
      // username이 변경된 경우 해당 username을 가진 모든 메시지의 username을 업데이트
      await this.model.updateMany({ username: this._conditions.username }, { $set: { username } });
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});


export const User = mongoose.model('user', userSchema);

export const Message = mongoose.model('Message', messageSchema);

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

// 유저 정보를 가져오는 함수
export const getUserData = async (email, password) => {
  try {
    const user = await User.findOne({ email, password });
    return user;
  } catch (error) {
    console.log(error);
    throw new Error('Error while getting user data from DB');
  }
};

export const updateUsername = async (email, password, username, newUsername) => {
  try {
    // 수정된 사용자 정보 반환
    const updatedUser = await User.findOneAndUpdate(
      { username: username, email: email, password: password }, // 일치하는 조건
      { username: newUsername }, // 수정할 값
      { new: true } // 수정된 문서 반환
    );
    // message 데이터베이스의 username 값을 업데이트
    await Message.updateMany(
      { username: username },
      { username: newUsername }
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
};


// email과 password가 일치하는 사용자를 찾아 password를 수정하는 함수
export const updatePassword = async (email, password, newPassword) => {
  try {
    // 수정된 사용자 정보 반환
    const updatedUser = await User.findOneAndUpdate(
      { email: email, password: password }, // 일치하는 조건
      { password: newPassword }, // 수정할 값
      { new: true } // 수정된 문서 반환
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
  //   const updatedUser = await User.findOneAndUpdate(
  //     { email: email, password: password },
  //     { password: newPassword },
  //     { new: true }
  //   );
  //   callback(null, updatedUser); // 성공적인 결과를 콜백으로 전달
  // } catch (error) {
  //   callback(error, null); // 오류를 콜백으로 전달
  // }
  
  // User.findOneAndUpdate(
  //   { email: email, password: password }, // 일치하는 조건
  //   { password: newPassword }, // 수정할 값
  //   { new: true }, // 수정된 문서 반환
  //   (err, updatedUser) => {
  //     if (err) {
  //       // 에러 발생 시 콜백 함수 호출
  //       callback(err, null);
  //     } else {
  //       // 수정된 사용자 정보 반환
  //       callback(null, updatedUser);
  //     }
  //   }
  // );
};

// 메시지를 저장하는 함수
export const saveMessage = async (username, message, messageID = 1) => {
  try {
    // 새로운 메시지 인스턴스 생성
    const newMessage = new Message({
      username,
      message,
      messageID
    });

    // 메시지 저장
    const savedMessage = await newMessage.save();

    console.log('메시지가 저장되었습니다:', savedMessage);
    return savedMessage;
  } catch (error) {
    console.error('메시지 저장 중 오류가 발생했습니다:', error);
    throw error;
  }
};

// username과 messageID를 통해 메시지를 조회하는 함수
export const findMessage = async (username, messageID) => {
  try {
    const message = await Message.findOne({ username: username, messageID: messageID });
    return message;
  } catch (error) {
    console.error("메시지 조회 중 오류가 발생했습니다:", error);
    return error
  }
}