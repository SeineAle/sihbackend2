import cors from "cors";
import express from "express";
import userRouter from "./user.js";
import dataRouter from "./data.js";
import analyticsRouter from "./analytics.js"

const router = express.Router({ mergeParams: true });
router.use(cors({ origin: '*' }));


router.get("/", (req, res) => {
  res.send("router used");
});

router.use("/user", userRouter);
router.use("/data", dataRouter);
router.use("/analytics", analyticsRouter);

export default router;