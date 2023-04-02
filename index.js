import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET, POST, PUT, DELETE, OPTION",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.post("/travelkeyword", async (req, res) => {
  // const { destination, startingPoint } = req.body;
  const destination = req.body.destination;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: destination,
      temperature: 0.6,
    });
    console.log(completion.data.choices[0].text);
    res.json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
