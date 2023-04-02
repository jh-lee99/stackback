import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  organization: "org-5wqEAjf3eFVxmogDQC9ZKNlB",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  // 추후 아래의 코드를 사용하여 destination, startingPoint을 받아라.
  /* 추후 아래의 조건문을 활용하여 startingPoint의 값이 비어있는 경우 
    프롬프트에 값을 전달할 변수를 생성하고
    generatePrompt와 같은 함수를 사용하여 키워드가 1개, 2개인 요청을 처리하라.
  */
  const { destination = '', startingPoint = '' } = req.body;
  if (destination.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid destination",
      }
    });
    return;
  }

  try {
    const prompt = startingPoint.trim().length === 0 ? 
    generateNoPathPrompt(destination) : generatePathPrompt(startingPoint, destination);

    const completion = await openai.createChatCompletion({
      // model: "text-davinci-003",
      // prompt: prompt,
      model: "gpt-3.5-turbo",
      messages : [
        {
          "role": "system",
          "content": "You are an assistant who introduces information about travel destinations and recommended tourist destinations to users who are traveling through the period and place entered by the user."
        },
        {"role": "user", "content": "I will travel from Seoul to Tokyo for 3 days and 2 nights"}
      ],
      temperature: 0.6,
      max_tokens: 2048,
    });
    // andwer 변수를 통해 response로 받은 content를 가져온다.
    const answer = completion.data.choices[0].message.content;
    console.log(answer);
    // 클라이언트에게 전송한다.
    res.json({ result: answer });
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
function generateNoPathPrompt(destination) {
  // date 변수는 프론트엔드에서 달력 컴포넌트를 통해 사용자의 여행 기간을 받아 사용하는 매개변수다.
  const date = '2'; // 매개변수로 만들고 삭제하라.
  // 백팃 (` `) 안에 프롬포트를 집어넣어서 구현해라.
  /* 주의: ${} 안에 텍스트를 사용하는것이 아니다. */
  return `
    ${destination}에서의 ${date}일 동안의 여행 스케줄을 짜 줘\n\n
    ${destination} 주변에 유명한 장소나 볼거리가 있다면 소개해줘}
  `;
}

// 추가로 키워드가 2개일 때 프롬포트를 생성하는 코드를 구현하라.
// 키워드가 1개일 때 프롬포트를 생성하는 코드이다.
function generatePathPrompt(destination, startingPoint) {
  // date 변수는 프론트엔드에서 달력 컴포넌트를 통해 사용자의 여행 기간을 받아 사용하는 매개변수다.
  const date = '2'; // 매개변수로 만들고 삭제하라.
  // 백팃 (` `) 안에 프롬포트를 집어넣어서 구현해라.
  /* 주의: ${} 안에 텍스트를 사용하는것이 아니다. */
  return `
    ${startingPoint}에서 ${destination}까지의 여행 스케줄을 짜 줘\n\n
    여행 기간은${date}일이고 
    {startingPoint}에서 ${destination}로 가는 경로에 유명한 곳이 있다면
    ${destination}과 같이 소개해줘}
  `;
}