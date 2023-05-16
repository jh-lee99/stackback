import { User, addUser, getUserData , updateUsername, updatePassword} from '../Database.js';
import jwt from "jsonwebtoken";

// accessToken 을 생성하는 함수
export const createAccessToken = async (userData) => {
  const accessToken = jwt.sign({
    username : userData.username,
    email : userData.email,
    password : userData.password,
  }, process.env.ACCESS_SECRET, {
    expiresIn : '1m',
    issuer : 'About Tech',
  });
  return accessToken;
}

// refreshToken 을 생성하는 함수
export const createRefreshToken = async (userData) => {
  const refreshToken = jwt.sign({
    username : userData.username,
    email : userData.email,
    password : userData.password,
  }, process.env.REFRESH_SECRET, {
    expiresIn : '1h',
    issuer : 'About Tech',
  });
  return refreshToken;
}

// accessToken 의 만료 여부를 확인하는 함수
export const isAccessTokenAlive = (accessToken) => {
console.log("호출: isAccessTokenAlive");
try {
  const data = jwt.verify(accessToken, process.env.ACCESS_SECRET);
  console.log("accessToken still alive.");
  console.log(data);
} catch (error) {
  console.log("accessToken was expired.");
  return false;
}
return true;
};

// accessToken 을 갱신하거나 반환하는 함수
export const refreshAccessToken = async (req, res) => {
  console.log("호출: refreshAccessToken");
  try {
    jwt.verify(req.accessToken, process.env.ACCESS_SECRET);
    console.log("accessToken still alive.");
    console.log("accessToken: ", req.accessToken);
    return accessToken;
  } catch {
    try {
      const data = jwt.verify(req.refreshToken, process.env.REFRESH_SECRET);
      const userData = await getUserData(data.email, data.password)
      createAccessToken(userData).then((token) => {
        console.log("newAccessToken: ", token);
        res.cookie("accessToken", token, {
          secure: false,
          httpOnly: true,
        });
      }).catch((error) => {
        console.log(error);
      });
      


      // const newAccessToken = createAccessToken(userData); // Access Token 새로 발급
      // console.log("newAccessToken was created");
      // console.log("newAccessToken: ", newAccessToken);
      // res.cookie("accessToken", newAccessToken, {
      //   secure : false,
      //   httpOnly : true,
      // })
      // return newAccessToken;
    } catch (error) {
      console.log("refreshToken was expired.");
      throw Error("refreshToken was expired.");
    }
  }
};

// 엑세스 토큰을 검증하고 만료되었다면 재발급하는 함수
export const verifyToken = async (req, res) => {
  console.log("호출: verifyToken");
  const accessToken = req.accessToken;
  if (isAccessTokenAlive(accessToken)) {
    res.status(200).json({
        message: "accessToken still alive."
    });
  } else {
    try {
      await refreshAccessToken(req, res);
      res.status(200).json({
        message: "newAccessToken was created."
      });
    } catch(error) {
      res.clearCookie("accessToken", {
        secure: false,
        httpOnly: true,
      });
      res.clearCookie("refreshToken", {
        secure: false,
        httpOnly: true,
      });
      res.status(500).json({
        error: "refreshToken was expired."
      });
    }
  }
}

// 로그인 성공 시 username, email 을 전송함
export const login = async (req, res) => {
  console.log("호출: login");
  const { email, password } = req.body; 
  const userData = await getUserData(email, password)
  if (!userData) {
    res.status(403).json({message: "등록되지 않은 사용자입니다."});
  } else {
    try {
      const accessToken = await createAccessToken(userData);    // access Token 발급
      const refreshToken = await createRefreshToken(userData);  // refresh Token 발급
      // token 쿠키에 설정
      res.cookie("accessToken", accessToken, {
        secure : false,
        httpOnly : true,
      })
      res.cookie("refreshToken", refreshToken, {
        secure : false,
        httpOnly : true,
      })
      res.status(200).json({
        username : userData.username,
        email : userData.email,
        message : "로그인이 성공적으로 이루어졌습니다!",
      });
      console.log(res.message);
    } catch (error) {
        res.status(500).json(error);
    }
  }
};

// 로그인 상태를 확인하기 위한 함수
export const loginSuccess = async (req, res) => {
  console.log("호출: loginSuccess");
  try {
    // 로그인 상태가 아닐 경우 엑세스 토큰 값이 비어있다.
    // 또는 만료상태이다.
    const accessToken = req.accessToken;
    if (accessToken) {
      const data = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      const userData = await getUserData(data.email, data.password);
      console.log("loginSuccess 상태코드 200");
      res.status(200).json(userData);
    } else throw Error("accessToken 만료되거나 존재하지 않음.")
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// 유저 네임과 이메일을 반환하는 함수
export const userInfo = async (req, res) => {
  console.log("호출: userInfo");
  try {
    const accessToken = refreshAccessToken(req, res);
    console.log("accessToken: ", accessToken);
    const data = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    console.log("data", data);
    res.status(200).json({username: data.username, email: data.email});
  } catch (err) {
    // await refreshToken(req, res);
    res.status(500).json(err);
  }
}

// 로그아웃 요청시 토큰 쿠키를 비우는 함수
export const logout = (req, res) => {
  console.log("호출: logout");
  try {
    res.clearCookie("accessToken", {
      secure: false,
      httpOnly: true,
    });
    res.clearCookie("refreshToken", {
      secure: false,
      httpOnly: true,
    });
    res.status(200).json({message: "To server: Logout Success"});
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const register = async (req, res) => {
  console.log("호출: register");
  try {
    const accessToken = refreshAccessToken(req, res);
    const userData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    await addUser(userData);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


export const updateusername = async (req, res) => {
  console.log("호출: updateusername");
  try {
    const accessToken = refreshAccessToken(req, res);
    const userData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const { email, username , password} = userData;
    const enteredPassword = req.body.password;
    // enteredPassword 값이랑 password 값이랑 같은지 보고 다르면 상태코드 400번대로 반환함.
    // 같으면 updateUsername 으로 데이터베이스 변경하고 200번 상태코드로 전송
    const newUsername = req.body.newUsername;
    const updatedUser = await updateUsername(email, password, username, newUsername);
    console.log("updateusername 완료");
    await res.status(200).json(updatedUser);
  } catch (error) {
    await res.status(500).json(error);
  } 
}

export const updatepassword = async (req, res) => {
  console.log("호출: updatepassword");
  try {
    const email = req.body.email;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const updatedUser = await updatePassword(email, password, newPassword);
    console.log("updatepassword 완료");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
}
