import express from "express";
import morgan from "morgan";
import { json as jsonParser } from "body-parser";

const app = express();
app.use(morgan("dev"));
app.use(jsonParser());

app.get("/", (req, res) => {
  res.end("hi");
});

const listener = app.listen(process.env.PORT || 3004, () => {
  console.log(`API server listening on ${listener.address().port}`);
});
