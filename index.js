import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin : "http://localhost:3001",
  methods : "GET, POST, PUT, DELETE, OPTION",
  credentials : true,
}));

app.post("/travelkeyword", async (req, res) => {
  // const { Destination, StartingPoint } = req.body;
  const Destination = req.Destination;
  console.log(req);

  try {
    const response = await axios.post('/api/generate', { 
      Destination 
    });
    // console.log(response.data);
    //res.sendStatus(200);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }

  /* something */
  //res.json({ result });
});


app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});