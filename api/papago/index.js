import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

// query 에 해당하는 언어 코드를 반환하는 함수
export const detectLanguage = async (query) => {
  console.log("호출: detectLanguage");
  const api_url = 'https://openapi.naver.com/v1/papago/detectLangs';
  try {
    const response = await axios.post(
      api_url, { query }, 
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_API_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_API_CLIENT_SECRET,
        }
    });
    console.log('Detect LangCode: ', response.data);
    return response.data.langCode;
  } catch (error) {
    // res.status(error.response.status).send(error.message);
    console.log('error = ' + error);
    return null;
  }
};

// source, target 의 언어코드를 받아 source 언어의 text 를 target 언어로 번역하는 함수
export const transelate = async (text, source, target) => {
  console.log("호출: transelate");
  var api_url = "https://openapi.naver.com/v1/papago/n2mt";
  try {
    const response = await axios.post(
      api_url,
      { source, target, text },
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID,
          "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET,
        },
      }
    );
    return response.data.message.result.translatedText;
  } catch (error) {
    console.log("transe error", error);
    return error;
  }
}