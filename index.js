import express from "express";
import bodyParser from 'body-parser';
import cors from "cors"; 
import travelkeyword from './travelkeyword.js';
//import db from'./db';
import loginController from'./controllers/loginController.js';
//import mongoose from 'mongoose';

// import usersRouter from './routes/usersRoutes.js';
//import indexRouter from './routes/index.js'; 아직 실행 안함

const app = express();


app.use(express.urlencoded({ extended: true })); // URL 인코딩 요청 중첩 개체 구문분석
app.use(express.json()); //json 형식 인코딩 데이터 처리
// app.use('/users', usersRouter);
//app.use('/index', indexRouter); 아직 실행 안함

app.use(cors({
  origin : "http://localhost:3001",
  methods : "GET, POST, PUT, DELETE, OPTION",
  credentials : true,
}));

app.use(bodyParser.json());

/* /travelkeyword 앤드포인트로 접근 시 사용자 입력 키워드에 대한 한글 답변을 출력한다. */
app.post("/travelkeyword", travelkeyword);
app.post('/login', function(req, res) {loginController.login});


// 포트 3000에서 리딩
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

/*
//몽구스 연결, 주소에서 연결 잘 됨
mongoose.connect('Mongo_URI', {
  dbName: 'for travel',
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 몽구스 연결 도중 연결이 끊길때 다시 연결해줌
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connections error:"))
db.once("open", () => {
  console.log("Database connected");
});

*/