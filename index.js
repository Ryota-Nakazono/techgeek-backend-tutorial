import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { TechGeekDB } from "./techgeek-db.js";
TechGeekDB.init();

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.post("/login", (req, res) => {
  const body = req.body;
  console.log(body);
  res.send(body);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
