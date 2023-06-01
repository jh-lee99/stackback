import { searchPlace } from '../api/google/index.js';
import { generate , generateTextLanguege} from '../api/openai/index.js';
import { detectLanguage, transelate } from '../api/papago/index.js';
import { addUser, getUserData, updateUsername, updatePassword, findMessage, saveMessage, } from "../database/index.js";
import { createAccessToken, createRefreshToken, isAccessTokenAlive, refreshAccessToken } from '../token/index.js';
import jwt from "jsonwebtoken";

// /api/token/verify
// 엑세스 토큰을 검증하고 만료되었다면 재발급하는 함수
export const verifyToken = async (req, res) => {
  console.log("호출: verifyToken");
  const accessToken = req.accessToken;
  const userdata = isAccessTokenAlive(accessToken);
  if (userdata) {
    res.status(200).json({ userdata });
  } else {
    try {
      const newAccessToken = await refreshAccessToken(req, res);
      const userdata = jwt.verify(newAccessToken, process.env.ACCESS_SECRET);
      res.status(200).json({
        userdata,
        message: "newAccessToken was created.",
      });
    } catch (error) {
      console.log("refreshToken was expired");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(500).json({
        error: "refreshToken was expired. Please log in again.",
      });
    }
  }
};

// 로그인 성공 시 username, email 을 전송함
export const login = async (req, res) => {
  console.log("호출: login");
  const { email, password } = req.body;
  const userData = await getUserData(email, password);
  if (!userData) {
    res.status(403).json({ message: "등록되지 않은 사용자입니다." });
  } else {
    try {
      const accessToken = createAccessToken(userData); // access Token 발급
      const refreshToken = createRefreshToken(userData); // refresh Token 발급
      // token 쿠키에 설정
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
      });
      res.status(200).json({
        username: userData.username,
        email: userData.email,
        message: userData.username + " 로그인",
      });
      // console.log(res.message);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// 로그아웃 요청시 토큰 쿠키를 비우는 함수
export const logout = (req, res) => {
  console.log("호출: logout");
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    console.log("로그아웃 성공");
    res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const register = async (req, res) => {
  console.log("호출: register");
  try {
    const userData = req.body;
    const createdUser = await addUser(userData);
    const accessToken = createAccessToken(createdUser);
    const refreshToken = createRefreshToken(createdUser);
    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
    });
    // const userData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    res.status(200).json({
      username: userData.username,
      email: userData.email,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateusername = async (req, res) => {
  console.log("호출: updateusername");
  try {
    const accessToken = await refreshAccessToken(req, res);
    const userData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const { email, username, password } = userData;
    const newUsername = req.body.newUsername;
    const enteredPassword = req.body.password;
    console.log(req.body);
    // enteredPassword 값이랑 password 값이랑 같은지 보고 다르면 상태코드 400번대로 반환함.
    // 같으면 updateUsername 으로 데이터베이스 변경하고 200번 상태코드로 전송
    if (enteredPassword === password) {
      const updatedUser = await updateUsername(email, password, username, newUsername);
      console.log("updateusername 완료");
      const accessToken = createAccessToken(updatedUser);
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });
      const refreshToken = createRefreshToken(updatedUser);
      res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
      });
      res.status(200).json(updatedUser);
    } else {
      console.log("비밀번호가 일치하지 않음");
      res.status(401).json({ message: "비밀번호가 일치하지 않음" });
    }
  } catch (error) {
    res.status(500).json({
      error: "refreshToken was expired. Please log in again.",
    });
    console.log("refreshToken was expired");
  }
};

export const updatepassword = async (req, res) => {
  console.log("호출: updatepassword");
  try {
    const accessToken = await refreshAccessToken(req, res);
    const userdata = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const email = req.body.email;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    console.log("userData.email:", userdata.email);
    console.log("userData.password:", userdata.password);
    console.log("email:", email);
    console.log("password:", password);
    console.log("newPassword:", newPassword);
    if (userdata.email === email && userdata.password === password) {
      const updatedUser = await updatePassword(email, password, newPassword);
      console.log("updatepassword 완료");
      const newUser = {
        username: userdata.username, 
        email:email, 
        password:newPassword,
      };
      const accessToken = createAccessToken(newUser);
      res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
      });
      const refreshToken = createRefreshToken(newUser);
      res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
      });
      res.status(200).json(updatedUser);
    } else {
      console.log("회원정보가 일치하지 않음");
      res.status(401).json({ message: "회원정보가 일치하지 않음" });
    }
  } catch (error) {
    res.status(500).json({
      error: "refreshToken was expired. Please log in again.",
    });
    console.log("refreshToken was expired");
  }
};

// 최근 생성된 답변을 가져오는 함수.
export const findmessage = async (req, res) => {
  console.log("호출: findmessage");
  try {
    const accessToken = await refreshAccessToken(req, res);
    const userData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const message = await findMessage(userData.username, req.query.messageID);
    if (!message) {
      return res.status(404).json({ error: "메시지를 찾을 수 없습니다." });
    }
    // 클라이언트에게 메시지 전송
    res.json(message);
  } catch (error) {
    console.error("메시지 조회 중 오류가 발생했습니다:", error);
    res.status(500).json({ error: "메시지 조회 중 오류가 발생했습니다." });
  }
};

// 장소를 검색해서 위도 경도를 반환하여 응답하는 함수
export const findLocation = async (req, res) => {
  try {
    console.log("호출: findLocation");
    const { query } = req.query;
    // 장소 키워드를 영어로 번역하여 검색한다.
    const from = await detectLanguage(query);
    const placeEN = await transelate(query, from, "en");
    const location = await searchPlace(placeEN);
    console.log("place", query, "placeEN", placeEN);
    res.send(location);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

export const travelkeyword = async (req, res) => {
  const accessToken = await refreshAccessToken(req, res);
  const userdata = jwt.verify(accessToken, process.env.ACCESS_SECRET);
  const username = userdata.username;
  const { dest = "", start = "", date = 1 , langcode} = req.body;

  const langText = generateTextLanguege(langcode)
  console.log("langcode:", langcode, "langtext:", langText);
  if (dest.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid destination",
      },
    });
    return;
  }

  // dest 와 start 의 언어코드를 파파고 언어감지 API 를 이용하여 반환
  const [dLangCode, sLangCode] = [await detectLanguage(dest), await detectLanguage(start)];
  // console.log("언어감지 완료: ", dLangCode, sLangCode);

  // 언어코드를 넘겨서 dest 와 start 의 값을 영어로 바꿔준다.
  const [destEN, startEN] = [await transelate(dest, dLangCode, 'en'), await transelate(start, sLangCode, 'en')];
  // console.log("목적지 및 출발지_한글 -> 영문번역 완료: ", destEN, startEN, '\n');

  // 영문 프롬포트를 생성해서 답변을 받아온다.
  let answer = await generate(destEN, startEN, date, langText);
  console.log("gpt 답변생성(원문) 완료: ", answer, "\n");

  // 받은 답변을 데이터베이스에 저장한다.
  await saveMessage(username, answer);

  // answerKO 를 클라이언트에게 전송한다.
  await res.json({ result: answer });
}