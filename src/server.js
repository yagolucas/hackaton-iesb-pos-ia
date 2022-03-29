const express = require("express");

const runnigRoute = require("./model/running");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok");
});

app.use("/running", runnigRoute);

app.listen(3000);
