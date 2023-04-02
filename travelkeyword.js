import detectLanguage from './api/detectLanguage.js';
import generate from './api/generate.js';
import transelate from './api/transelate.js';

export default async function (req, res) {
  /** /travelkeyword 호출시 수행과정 *
   * travelkeyword 앤드포인트로 접근 시 서버가 하는 전체적인 처리과정을 수행하는 파일이다.
   * 사용자로부터 받은 키워드를 detectLanguage(req, res, dest, start)를 사용해 언어 코드를 반환
   * 반환한 언어 코드가 eng가 아닐 경우 키워드를 영어로 변환
   * 반환된 키워드를 generate(dest, start)를 사용해 completion을 생성함.
   * completion.data.choices[0].message.content를 가져와 text 변수로 관리
   * text(답변) 변수를 transelate.js를 사용해 번역
   * dest, start를 transelate.js를 사용해 번역
   * 번역된 dest, start, text를 DB에 저장
   * 번역된 text를 result로 클라이언트에게 전송
   */

  const { destination = '', startPoint = '' } = req.body;
  if (destination.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid destination",
      }
    });
    return;
  }

  // // dest와 start의 언어코드
  // const [dLangCode, sLangCode] = ['ko', 'ko'];
  // dLangCode = detectLanguage(destination);
  // sLangCode = detectLanguage(startPoint);
  // // 언어코드를 넘겨서 dest 와 start 의 값을 영어로 바꿔준다.
  // [destination, startPoint] = transelate(req, res, destination, dLangCode, startPoint, sLangCode);


  // 영문 프롬포트를 생성해서 답변을 받아온다.
  const answer = await generate(req, res, destination, startPoint);
  // answer 를 클라이언트에게 전송한다.
  res.json({ result: answer });
}