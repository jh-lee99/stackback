import express from "express";
import bodyParser from 'body-parser';
import cors from "cors"; 
import travelkeyword from './travelkeyword.js';
import connect from './schemas/db.js';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import pageRouter from './routes/pages.js';
//import passportConfig from './passport';
import session from 'express-session';
import nunjucks from 'nunjucks';
import passport from 'passport';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
//import loginController from'./controllers/loginController.js';

// import usersRouter from './routes/usersRoutes.js';
//import indexRouter from './routes/index.js'; 아직 실행 안함

const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});


connect();
//passportConfig(); //패스포트 설정
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', pageRouter);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false })); // URL 인코딩 요청 중첩 개체 구문분석
app.use(express.json());
// app.use(cookieParser(process.env.COOKIE_SECRET));


app.use(cors({
  origin : "http://localhost:3001",
  methods : "GET, POST, PUT, DELETE, OPTION",
  credentials : true,
}));

app.use(bodyParser.json());

/* /travelkeyword 앤드포인트로 접근 시 사용자 입력 키워드에 대한 한글 답변을 출력한다. */
app.post("/travelkeyword", travelkeyword);

app.use((req, res, next) => {
  const error = new error('${req.method} ${req.url} 라우터가 없습니다.');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

dotenv.config();

// 포트 3000에서 리딩
app.listen(app.get('port'), () => {
  console.log("Server is listening on port 3000");
});

function newFunction() {
  return require('passport');
}