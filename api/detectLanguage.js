// query 에 해당하는 언어 코드를 반환하는 함수
import axios from 'axios';

export default async function (req, res, query) {
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
    // res.status(200).json(response.data);
    // console.log('Detect LangCode: ', response.data);
    return response.data.langCode;
  } catch (error) {
    res.status(error.response.status).send(error.message);
    console.log('error = ' + error.response.status);
  }
};