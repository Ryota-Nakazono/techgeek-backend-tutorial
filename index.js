import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { TechGeekDB } from "./techgeek-db.js";
TechGeekDB.init();
import { userRouter, productRouter, orderRouter } from "./routes/index.js";
import serveStatic from "serve-static";
import { readFileSync } from "fs";
import { join } from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
userRouter(app);
productRouter(app);
orderRouter(app);

const STATIC_PATH = `${process.cwd()}/frontend`;
app.use(serveStatic(STATIC_PATH, { index: ["index.html"] }));

app.get("/*", (req, res) => {
  console.log(STATIC_PATH + req.originalUrl + ".html");
  const contentHtml = readFileSync(STATIC_PATH + req.originalUrl + ".html", "utf-8");
  res.status(200).setHeader("Content-Type", "text/html").send(contentHtml);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
