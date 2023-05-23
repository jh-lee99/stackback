/** /travelkeyword 호출시 수행과정 *
 * travelkeyword 앤드포인트로 접근 시 서버가 하는 전체적인 처리과정을 수행하는 파일이다.
 * 사용자로부터 받은 키워드를 detectLanguage(req, res, dest, start) 를 사용해 언어 코드를 반환
 * 반환한 언어 코드가 en 가 아닐 경우 키워드를 영어로 변환
 * 반환된 키워드를 generate(dest, start) 를 사용해 가져와 answer 변수로 관리
 * answer(답변) 변수를 transelate.js 를 사용해 번역
 * dest, start 를 transelate.js 를 사용해 번역
 * 번역된 dest, start, answer 를 DB에 저장
 * 번역된 answer 를 result 로 클라이언트에게 전송
 */
import detectLanguage from "./api/detectLanguage.js";
import generate from "./api/generate.js";
import transelate from "./api/transelate.js";
import { saveMessage } from "./Database.js";
import jwt from "jsonwebtoken";

export default async function (req, res) {
  const findError = function (text) {
    if (res.statusCode >= 400 && res.statusCode < 600) {
      console.log(`Error occurred ${text}:`, res.statusMessage);
      return true;
    } else return false;
  };
  const userdata = jwt.verify(req.accessToken, process.env.ACCESS_SECRET);
  const username = userdata.username;

  const { dest = "", start = "", date = 1 } = req.body;
  if (dest.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid destination",
      },
    });
    return;
  }

  // const [destEN, startEN] = ['ko', 'ko'];

  // dest 와 start 의 언어코드를 파파고 언어감지 API 를 이용하여 반환
  // const [dLangCode, sLangCode] = [await detectLanguage(req, res, dest), await detectLanguage(req, res, start)];
  // if (findError("detectLanguage")) return;
  // console.log("언어감지 완료: ", dLangCode, '\n');

  // 언어코드를 넘겨서 dest 와 start 의 값을 영어로 바꿔준다.
  // [destEN, startEN] = [await transelate(req, res, dest, dLangCode, 'en'), await transelate(req, res, start, sLangCode, 'en')];
  // if (findError("translate_keyword")) return;
  // console.log("키워드 한글 -> 영문번역 완료: ", destEN, startEN, '\n');

  // 영문 프롬포트를 생성해서 답변을 받아온다.
  let answer = await generate(req, res, dest, start, date);
  if (findError("generate")) return;
  console.log("gpt 답변생성(원문) 완료: ", answer, "\n");

  // 받은 답변을 한글로 번역한다.
  // answer = await transelate(req, res, answer, 'en', 'ko')
  // if (findError("translate_answer")) return;
  // console.log("gpt 답변번역 완료: ", answer, '\n');
  // 받은 답변을 데이터베이스에 저장한다.
  await saveMessage(username, answer);

  // answerKO 를 클라이언트에게 전송한다.
  await res.json({ result: answer });
}
