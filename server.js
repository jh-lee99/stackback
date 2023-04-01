const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 3000번 포트에서 받는중
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});


