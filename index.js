import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { verifyToken, login, logout, register, updateusername, updatepassword, findmessage, } from "./controller/index.js";
import { travelkeyword } from './controller/index.js';
import { findLocation } from './controller/index.js';
import { connectDB } from "./database/index.js";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET, POST, PUT, DELETE, OPTION",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  req.accessToken = accessToken; // accessToken을 req 객체의 프로퍼티로 저장
  req.refreshToken = refreshToken; // refreshToken을 req 객체의 프로퍼티로 저장
  next();
});

app.get("/api/token/verify", verifyToken);

app.post("/login", login);

app.post("/logout", logout);

app.post("/register", register);

app.post("/update/user", updateusername);

app.post("/update/password", updatepassword);

app.get("/findmessage", findmessage);

app.get("/findLocation", findLocation);

/* /travelkeyword 앤드포인트로 접근 시 사용자 입력 키워드에 대한 한글 답변을 출력한다. */
app.post("/travelkeyword", travelkeyword);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

connectDB();