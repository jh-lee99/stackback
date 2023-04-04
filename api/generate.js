// gpt-3.5 모델을 통해 답변을 생성하는 함수
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res, dest, start) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  try {
    const prompt = start.trim().length === 0 ? 
    generateNoPathPrompt(dest) : generatePathPrompt(start, dest);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages : [
        {
          "role": "system",
          "content": `You are an assistant who introduces information 
          about travel destinations and recommended tourist destinations to users 
          who are traveling through the period and place entered by the user.`
        },
        {"role": "user", "content": prompt}
      ],
      temperature: 0.6,
      max_tokens: 2048,
    });
    // response 로 받은 content 를 반환한다.
    return completion.data.choices[0].message.content;
    
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
  
}

// 키워드가 1개일 때 프롬포트를 생성하는 코드이다.
function generateNoPathPrompt(dest) {
  // date 변수는 프론트엔드에서 달력 컴포넌트를 통해 사용자의 여행 기간을 받아 사용하는 매개변수다.
  const date = '2'; // 매개변수로 만들고 삭제하라.
  // 백팃 (` `) 안에 프롬포트를 집어넣어서 구현해라.
  /* 주의: ${} 안에 텍스트를 사용하는것이 아니다. */

  // 나는 ${destination}로 ${date}일간의 여행을 갈거야.
  // ${destination}에서 추천할만한 여행지가 있다면 추천해줘.
  // 그리고 여행을 하면서 알면 좋을 다른것들도 추천해줬으면 좋겠어.
  return `
    I'm going on a ${date}-day trip to ${dest}.
    If you have any travel destinations to recommend in ${dest}, please recommend them.
    Also, please recommend other things to know while traveling.
  `;
}

// 추가로 키워드가 2개일 때 프롬포트를 생성하는 코드를 구현하라.
// 키워드가 1개일 때 프롬포트를 생성하는 코드이다.
function generatePathPrompt(dest, start) {
  // date 변수는 프론트엔드에서 달력 컴포넌트를 통해 사용자의 여행 기간을 받아 사용하는 매개변수다.
  const date = '2'; // 매개변수로 만들고 삭제하라.
  // 백팃 (` `) 안에 프롬포트를 집어넣어서 구현해라.
  /* 주의: ${} 안에 텍스트를 사용하는것이 아니다. */

  // 나는 ${start}에서 출발해서 ${dest}로 ${date}일간의 여행을 갈거야.
  // ${dest}에서 추천할만한 여행지가 있다면 추천해줘.
  // 그리고 여행을 하면서 알면 좋을 다른것들도 추천해줬으면 좋겠어.
  return `
    I'm going on a ${date}-day trip to ${dest} from ${start}.
    If you have any travel destinations to recommend in ${dest}, please recommend them.
    Also, please recommend other things to know while traveling.
  `;
}