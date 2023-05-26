import jwt from 'jsonwebtoken';

// userData 객체(username, email, password)를 통해 accessToken 을 생성하는 함수
export const createAccessToken = (userData) => {
  const accessToken = jwt.sign(
    {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "1m",
      issuer: "About Tech",
    }
  );
  return accessToken;
};

// userData 객체(username, email, password)를 통해 refreshToken 을 생성하는 함수
export const createRefreshToken = (userData) => {
  const refreshToken = jwt.sign(
    {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "1h",
      issuer: "About Tech",
    }
  );
  return refreshToken;
};

// accessToken 의 만료 여부를 확인한다.
// 아직 유효할 경우 payload 반환
// 만료되었을 경우 null 반환
export const isAccessTokenAlive = (accessToken) => {
  console.log("호출: isAccessTokenAlive");
  try {
    const data = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    console.log("accessToken still alive.");
    console.log(data);
    return data;
  } catch (error) {
    console.log("accessToken was expired.");
    return null;
  }
};

// accessToken 을 갱신하거나 반환하는 함수
export const refreshAccessToken = async (req, res) => {
  console.log("호출: refreshAccessToken");
  try {
    jwt.verify(req.accessToken, process.env.ACCESS_SECRET);
    console.log("accessToken still alive.");
    return req.accessToken;
  } catch {
    try {
      console.log("accessToken was expired.");
      const data = jwt.verify(req.refreshToken, process.env.REFRESH_SECRET);
      const userData = { username: data.username, email: data.email, password: data.password };
      const newAccessToken = createAccessToken(userData);
      console.log("newAccessToken: ", newAccessToken);
      res.cookie("accessToken", newAccessToken, {
        secure: false,
        httpOnly: true,
      });
      return newAccessToken;
    } catch (error) {
      console.log("refreshToken was expired.");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return null;
    }
  }
};