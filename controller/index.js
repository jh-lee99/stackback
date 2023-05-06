import Database from '../Database.js';
import jwt from "jsonwebtoken";

const login = (req, res, next) => {
  console.log("호출: login");
  const { email } = req.body; 
    const userInfo = Database.filter((item) => {
      return item.email === email;
    })[0];
  
    if (!userInfo) {
      res.status(403).json("To server: Not Authorized");
    } else {
      try {
        // access Token 발급
        const accessToken = jwt.sign({
          username : userInfo.username,
          email : userInfo.email,
        }, process.env.ACCESS_SECRET, {
          expiresIn : '1m',
          issuer : 'About Tech',
        });
  
        // refresh Token 발급
        const refreshToken = jwt.sign({
          username : userInfo.username,
          email : userInfo.email,
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
          username : userInfo.username,
          email : userInfo.email,
          message : "To server: login success",
        });
  
  
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
    console.log("token: ", token);

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
  const refreshToken = (req, res) => {
    console.log("호출: refreshToken");
    try {
      const token = req.body.refreshToken;
      console.log("refreshToken: ", token);
      // 여기 try-catch문 추가로 작성해서 토큰 만료시의 동작을 작성함.
      // catch문에 clg로 Refresh token not found 추가해야함
      // try {
      const data = jwt.verify(token, process.env.REFRESH_SECRET);
      // console.log(data);
      console.log("jwt.verify");
      const userData = Database.filter(item => {
        return item.email === data.email;
      })[0];
      // console.log("get refreshToken: ", token);
      
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
      console.log(error);
      res.status(500).json(error);
    }
  };
  
  const loginSuccess = (req, res) => {
    console.log("호출: loginSuccess");
    try {
      const token = req.cookies.accessToken;
      const data = jwt.verify(token, process.env.ACCESS_SECRET);
  
      const userData = Database.filter(item=>{
        return item.email === data.email;
      })[0];

      console.log("loginSuccess 상태코드 200");
      res.status(200).json(userData);
  
    } catch (error) {
      console.log("loginSuccess 상태코드 500");
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
    console.log("token: ", token);

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      console.log("decoded", decoded);
      res.send(decoded);
    } catch (err) {
      res.status(500).json(err);
    }
  }

export {
  login,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
  userInfo,
};