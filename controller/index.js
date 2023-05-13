import { User, addUser, getUserData } from '../Database.js';
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  console.log("호출: login");
  const { email } = req.body; 
  const userdata = await getUserData(email)
  
  if (!userdata) {
    res.status(403).json("To server: Not Authorized");
  } else {
    try {
      // access Token 발급
      const accessToken = jwt.sign({
        username : userdata.username,
        email : userdata.email,
      }, process.env.ACCESS_SECRET, {
        expiresIn : '1m',
        issuer : 'About Tech',
      });

      // refresh Token 발급
      const refreshToken = jwt.sign({
        username : userdata.username,
        email : userdata.email,
      }, process.env.REFRESH_SECRET, {
        expiresIn : '1h',
        issuer : 'About Tech',
      })

      // token 전송
      res.cookie("accessToken", accessToken, {
        secure : false,
        httpOnly : false,
      })

      res.cookie("refreshToken", refreshToken, {
        secure : false,
        httpOnly : false,
      })

      res.status(200).json({
        username : userdata.username,
        email : userdata.email,
        message : "To server: login success",
      });
      console.log("login success");

    } catch (error) {
        res.status(500).json(error);
    }
  }
};
  
// 용도 : access token의 만료 여부 확인.
const accessToken = (req, res) => {
  console.log("호출: accessToken");
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log("accessToken: ", token);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log(decoded);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('Access token expired');
      // refresh token을 이용해 새로운 access token을 발급받는 코드 작성
      // refreshToken(req, res);
      return res.status(401).send({ message: 'To server: Access token not found' });
    } else {
      console.log('Access token not found');
      return res.status(401).send({ message: 'To server: Access token not found' });
    }
  }
  // 토큰이 유효한 경우
  res.status(200).send({ message: 'To server: Access token still alive' });
};

// 용도 : access token을 갱신.
const refreshToken = async (req, res) => {
  console.log("호출: refreshToken");
  try {
    const token = req.body.refreshToken;
    console.log("refreshToken: ", token);
    // 여기 try-catch문 추가로 작성해서 토큰 만료시의 동작을 작성함.
    // catch문에 clg로 Refresh token not found 추가해야함
    // try {
    const data = jwt.verify(token, process.env.REFRESH_SECRET);
    //  console.log(data);
    // console.log("jwt.verify");

    const userData = await getUserData(data.email)
    
    // Access Token 새로 발급
    const accessToken = jwt.sign({
      username: userData.username,
      email: userData.email,
    }, process.env.ACCESS_SECRET, {
      expiresIn: '1m',
      issuer: 'About Tech',
    });
    console.log("newAccessToken was created!!!");

    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: false,
    });

    res.status(200).json({
      accessToken: accessToken
    }); // 수정된 부분

  } catch (error) {
    // console.log(error);
    res.status(500).json(error);
  }
};

const loginSuccess = async (req, res) => {
  console.log("호출: loginSuccess");
  try {
    const token = req.cookies.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const userData = await getUserData(data.email)

    console.log("loginSuccess 상태코드 200");
    res.status(200).json(userData);

  } catch (error) {
    console.log("loginSuccess 상태코드 500", error);
    res.status(500).json(error);
  }
};

const logout = (req, res) => {
  console.log("호출: logout");
  try {
    res.cookie('accessToken', '');
    res.status(200).json("To server: Logout Success");
  } catch (error) {
    res.status(500).json(error);
  }
};

const userInfo = (req, res) => {
  console.log("호출: userInfo");
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log("accessToken: ", token);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("decoded", decoded);
    res.send(decoded);
  } catch (err) {
    res.status(500).json(err);
  }
}

const register = async (req, res) => {
  console.log("호출: register");
  try {
    const { username, email, password } = req.body; // username 변수를 정확히 추출
    const userdata = { username, email, password }; // userdata 객체 생성
    await addUser(userdata);
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export {
  login,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
  userInfo,
  register,
};