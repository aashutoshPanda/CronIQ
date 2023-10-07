import express from "express";
import authRouter from "./auth.js";
import oneTimeJobRouter from "./oneTimeJobs.js";
import cronJobRouter from "./cronJobs.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/one-time-job", isAuthenticated, oneTimeJobRouter);
router.use("/api/cron-job", isAuthenticated, cronJobRouter);

export default router;
