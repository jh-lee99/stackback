const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/generate", (req, res) => {
  const { animal } = req.body;
  /* something */
  res.json({ result });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});