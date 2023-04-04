/*

// 미들웨어를 등록한다
app.use(serveStatic(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// 미들웨어에서 쿠키랑 세션을 확인한다.
app.use(cookieParser());

// 세션세팅
app.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/process/example", (req, res) => {
  if (req.session.user) {
    // 세션에 유저가 존재한다면
    res.redirect("/example.html"); // 예시로
  } else {
    res.redirect("/login.html"); // 로그인으로
  }
});

app.post("/process/login", (req, res) => {
  console.log("로그인 함수가 실행됩니다.");

  console.log(req.body.data);
  console.log(req.password);

  const paramID = req.body.id || req.query.id;
  const pw = req.body.password || req.query.password;

  if (req.session.user) {
    // 세션에 유저가 존재한다면
    console.log("이미 로그인 돼있습니다~");
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
    res.write("<h1> already Login</h1>");
    res.write(`[ID] : ${paramID} [PW] : ${pw}`);
    res.write('<a href="/process/example">예시로</a>');
    res.end();
  } else {
    req.session.user = {
      id: paramID,
      pw: pw,
      name: "UsersNames!!!!!",
      authorized: true,
    };
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" });
    res.write("<h1>Login Success</h1>");
    res.write(`[ID] : ${paramID} [PW] : ${pw}`);
    res.write('<a href="/process/example">Move</a>');
    res.end();
  }
});

app.get("/process/logout", (req, res) => {
  console.log("로그아웃");

  if (req.session.user) {
    console.log("로그아웃중입니다!");
    req.session.destroy((err) => {
      if (err) {
        console.log("세션 삭제시에 에러가 발생했습니다.");
        return;
      }
      console.log("세션이 삭제됐습니다.");
      res.redirect("/login.html");
    });
  } else {
    console.log("로그인이 안돼있으시네요?");
    res.redirect("/login.html");
  }
});
*/
