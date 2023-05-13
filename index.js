import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  login,
  accessToken,
  refreshToken,
  loginSuccess,
  logout,
  userInfo,
} from "./controller/index.js";
import travelkeyword from "./travelkeyword.js";
import findLocation from "./api/findLocation.js";
import { connectDB, addUser } from "./Database.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET, POST, PUT, DELETE, OPTION",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/login", login);

app.get("/api/token/access", accessToken);

app.post("/api/token/refresh", refreshToken);

app.get("/login/success", loginSuccess);

app.post("/logout", logout);

app.get("/userinfo", userInfo);

app.get("/findLocation", findLocation);

/* /travelkeyword 앤드포인트로 접근 시 사용자 입력 키워드에 대한 한글 답변을 출력한다. */
app.post("/travelkeyword", travelkeyword);

app.get("/findLocation", findLocation);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
// const data = {
//   username : 'admin',
//   email : 'admin',
//   password : 'admin'
// };

connectDB();
// addUser(data).then(() => console.log("admin 계정 생성 완료!"))
// .catch(err => {
//   console.log("admin 이미 생성됨");
// });
