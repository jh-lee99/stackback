import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// gpt-3.5 모델을 통해 답변을 생성하는 함수
export const generate = async (dest, start, date, langText) => {
  if (!configuration.apiKey) {
    const error = new Error('OpenAI API key not configured');
    error.name = 'OpenAI API key not configured';
    return error;
  }

  try {
    const prompt = start.trim().length === 0 
    ? generateNoPathPrompt(dest, date) 
    : generatePathPrompt(dest, start, date);
    console.log("start: ", start);
    console.log("dest: ", dest);
    console.log("date: ", date);
    console.log("prompt: ", prompt);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: 
`You are an assistant that receives input from the user who is going on a trip and where the starting point and destination are, and introduces other attractions that the user can travel around the destination.

Users can enter both the origin and destination, or only the destination.

When the user inputs both the starting point and the destination, an additional answer is given on how to move from the starting point to the destination.`,
        },
        {
          role: "system",
          content: 
`When the user introduces other attractions that can be traveled around the destination, the front and rear of the place are marked as follows.

석불암' should be written as '<a class="location" href="#" location="석불암"> 석불암 </a>'.
          
'Dabotap and Seokgatap' is should be written as '<a class="location" href="#" location="Dabotap">Dabotap</a> and <a class="location" href="#" location="Seokgatap">Seokgatap</a>'`,
        },
        {
          role: "user",
          content: 
`I'm going on a 2-day trip to Bulguksa Temple from Wonju City. If you have any travel destinations to recommend in Bulguksa Temple, please recommend them. Also, please recommend other things to know while traveling.`,
        },
        {
          role: "system",
          content: `Keep in mind that regardless of language, words that mean places are always printed in <a class="location" href="#" location=placeName>placeName</a> format.`,
        },
        { role: "system", content: "한국어로 답변해줘" },
        {
          role: "user",
          content: 
`I will travel from 부산 to 서울 for 2 days.
If you have any recommended travel destinations near 서울, please recommend them.
And I wish there was an explanation of the background of the recommended travel destination.
Also, please suggest other things to be aware of during your trip.
I want a long and detailed explanation.`,
        },
        {
          role: "assistant",
          content: 
`부산에서 서울로 여행을 떠나는 건 멋진 결정이에요! 서울 근처에는 많은 멋진 관광지가 있어요. 추천 관광지로는 다음과 같은 곳들이 있습니다:

1. <a class="location" href="#" location="경복궁">경복궁</a>: 대한민국의 대표 궁궐 중 하나인 <a class="location" href="#" location="경복궁">경복궁</a>은 조선 왕조의 건축물 중 가장 아름답고 대표적인 건축물입니다. 1395년에 건립되었으며, 서울에서 가장 인기 있는 관광지 중 하나입니다. 궁궐 내부에는 서울의 역사와 문화를 알 수 있는 박물관도 있습니다.

2. <a class="location" href="#" location="북촌 한옥마을">북촌 한옥마을</a>: <a class="location" href="#" location="북촌 한옥마을">북촌 한옥마을</a>은 전통적인 한옥 건축물과 오래된 한국 문화를 경험할 수 있는 곳입니다. 이곳에서는 전통적인 한식 음식을 맛볼 수 있으며, 전통적인 한국 문화 체험도 가능합니다.

3. <a class="location" href="#" location="남산타워">남산타워</a>: 236미터 높이에 위치한 <a class="location" href="#" location="남산타워">남산타워</a>는 서울에서 가장 높은 전망대 중 하나입니다. 타워의 맨 위에서는 서울의 멋진 야경을 감상할 수 있습니다.

4. <a class="location" href="#" location="광장시장">광장시장</a>: <a class="location" href="#" location="광장시장">광장시장</a>은 서울에서 가장 유명한 주점거리 중 하나입니다. 이곳에서는 전통적인 한국 음식과 음료를 맛볼 수 있으며, 쇼핑도 즐길 수 있습니다.

이 외에도 서울에는 많은 관광지가 있으니, 시간이 된다면 여러 곳을 방문해 보시는 것도 좋은 방법입니다.

추천 관광지의 배경에 대한 설명을 드리자면, 경복궁은 조선 왕조의 건축물로, 대한민국의 대표적인 궁궐 중 하나입니다. 북촌 한옥마을은 전통적인 한국 문화와 건축물을 경험할 수 있는 곳으로, 오래된 한국 문화를 체험하고 싶은 분들에게 추천합니다. 남산타워는 서울에서 가장 높은 전망대 중 하나로, 멋진 야경을 감상할 수 있습니다. 광장시장은 전통적인 한국 음식과 음료를 맛볼  수 있으며, 쇼핑도 즐길 수 있는 곳입니다.

또한, 여행 중에는 몇 가지 사항을 유념해야 합니다. 먼저, 한국은 사계절이 확실하게 나뉘어 있기 때문에, 계절에 따라 적절한 옷차림을 준비해야 합니다. 또한, 한국은 영어를 잘하는 사람이  많지 않기 때문에, 기본적인 한국어 회화를 준비하는 것이 좋습니다. 마지막으로, 한국의 문화와 관습을 존중하는 것도 중요합니다. 예를 들어, 사찰이나 절 등의 신성한 장소에는 신문지나 쓰레기를 버리지 않는 것이 예의에 맞는 것입니다.`,
        },
        { role: "system", content: langText },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 2048,
    });
    // response 로 받은 content 를 반환한다.
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.log("Failed to generate answer");
    return error;
  }
}

// 키워드가 1개일 때 프롬포트를 생성하는 코드이다.
function generateNoPathPrompt(dest, date) {
  // 나는 ${destination}로 ${date}일간의 여행을 갈거야.
  // ${destination}에서 추천할만한 여행지가 있다면 추천해줘.
  // 그리고 여행을 하면서 알면 좋을 다른것들도 추천해줬으면 좋겠어.
  return `I'm going on a ${date}-day trip to ${dest}.
If you have any recommended travel destinations near ${dest}, please recommend them.
And I wish there was an explanation of the background of the recommended travel destination.
Also, please suggest other things to be aware of during your trip.
I want a long and detailed explanation.`;
}

// 키워드가 2개일 때 프롬포트를 생성하는 코드이다.
function generatePathPrompt(dest, start, date) {
  // 나는 ${start}에서 출발해서 ${dest}로 ${date}일간의 여행을 갈거야.
  // ${dest}에서 추천할만한 여행지가 있다면 추천해줘.
  // 그리고 여행을 하면서 알면 좋을 다른것들도 추천해줬으면 좋겠어.
  return `I will travel from ${start} to ${dest} for ${date} days.
If you have any recommended travel destinations near ${dest}, please recommend them.
And I wish there was an explanation of the background of the recommended travel destination.
Also, please suggest other things to be aware of during your trip.
I want a long and detailed explanation.`;
}

export function generateTextLanguege(langcode) {
  switch (langcode) {
    case "ko": {
      return "한국어로 답변해줘"
    }
    case "en": {
      return "answer in english"
    }
    case "ja": {
      return "answer in japanese"
    }
    default: {
      return "한국어로 답변해줘"
    }
  }
}