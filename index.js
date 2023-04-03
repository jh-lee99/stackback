import express from "express";
import bodyParser from 'body-parser';
import cors from "cors"; 
import travelkeyword from './travelkeyword.js';

// var fs = require('fs');
// var bodyParser = require('body-parser')
// var compression = require('compression')

const app = express();

app.use(cors({
  origin : "http://localhost:3001",
  methods : "GET, POST, PUT, DELETE, OPTION",
  credentials : true,
}));

app.use(bodyParser.json());

/* /travelkeyword 앤드포인트로 접근 시 사용자 입력 키워드에 대한 한글 답변을 출력한다. */
app.post("/travelkeyword", travelkeyword);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// router.use("./models", modelsRouter); //models router 적용
// router.use("./api", apiRouter); //users router 적용

// app.use(function (req, res, next) {
//   res.status(404).send('Sorry can`t find that')
// });

// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })

// app.listen(3000, () => {
//   console.log('Example app listening on port 3000!')
// })
