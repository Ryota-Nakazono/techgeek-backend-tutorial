import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { TechGeekDB } from "./techgeek-db.js";
TechGeekDB.init();
import { publicRouter, userRouter, productRouter, orderRouter } from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(express.json());
publicRouter(app);
userRouter(app);
productRouter(app);
orderRouter(app);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
