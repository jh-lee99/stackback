import { post } from 'axios';

function generateText(prompt, apiKey, callback) {
  const data = {
    prompt: prompt,
    temperature: 0.5,
    max_tokens: 100,
    n: 1,
    stop: "\n"
  };
  
  post('https://api.openai.com/v1/engines/davinci-codex/completions', data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  })
  .then(response => {
    callback(response.data.choices[0].text);
  })
  .catch(error => {
    console.log(error);
  });
}