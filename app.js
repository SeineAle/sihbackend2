import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import rootRouter from "./routes/index.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: '*' }));

main().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/v1", rootRouter);

async function main() {
  const MONGO_URI = process.env.DB_URI;
  await mongoose.connect(MONGO_URI);
  console.log("db connected");
  app.listen(PORT, (req, res) => {
    console.log(`Server started, listening on port ${PORT}`);
  });
}