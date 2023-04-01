import express from "express";
import bodyParser from 'body-parser';
import cors from "cors"; 
import generate from './api/generate.js';

const app = express();

app.use(cors({
  origin : "http://localhost:3001",
  methods : "GET, POST, PUT, DELETE, OPTION",
  credentials : true,
}));

app.use(bodyParser.json());

app.post("/travelkeyword", generate);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});