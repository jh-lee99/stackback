import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
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
  // const { destination, startingPoint } = req.body;
  const destination = req.body.destination || '';
  if (destination.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid destination",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(destination),
      temperature: 0.6,
    });
    console.log(completion.data.choices[0].text);
    res.json({ result: completion.data.choices[0].text });
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
function generatePrompt(destination) {
  const capitalizedAnimal =
    destination[0].toUpperCase() + destination.slice(1).toLowerCase();
  return `
  ${
    // 백팃 (` `) 안에 프롬포트를 집어넣어서 구현해라.
    /* 주의: ${} 안에 텍스트를 사용하는것이 아니다. */
    capitalizedAnimal
  }
  `;
}

// 추가로 키워드가 2개일 때 프롬포트를 생성하는 코드를 구현하라.