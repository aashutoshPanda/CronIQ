import express from "express";
import authRouter from "./auth.js";
import oneTimeJobRouter from "./oneTimeJobs.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/one-time-job", isAuthenticated, oneTimeJobRouter);

export default router;
