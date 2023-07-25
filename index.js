import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/users", (req, res) => {
  res.send("<h1>Users</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});