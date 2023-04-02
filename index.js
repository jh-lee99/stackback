import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import generate from "./api/generate.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET, POST, PUT, DELETE, OPTION",
    credentials: true,
  })
);

app.use(bodyParser.json());

/** /travelkeyword 앤드포인트로 접근 시 사용자 입력 키워드에 대한 답변을 출력한다.
 * 전체적인 api 사용 과정은 다음과 같다. *
 * 사용자 입력 키워드 수신
 * -> 파파고 API 언어감지 기능 사용(한국어 이외의 언어 코드를 반환한다면 키워드를 한국어로 번역 후 프롬포트 생성)
 * ->
 */
app.post("/travelkeyword", generate);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
