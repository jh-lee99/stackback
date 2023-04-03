// source, target 의 언어코드를 받아 source 언어의 text 를 target 언어로 번역하는 함수
import axios from 'axios';

export default async function (req, res, text, source, target) {
  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  try {
    const response = await axios.post(
      api_url, { source, target, text },
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_API_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_API_CLIENT_SECRET,
        }
      }
    );
    return response.data.message.result.translatedText
  } catch (error) {
    console.log(error, "transe error");
    res.status(error.response.status).send(error.message);
  };
}