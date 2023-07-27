import express from "express";
import authRouter from "./auth.js";
import jobsRouter from "./jobs.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/jobs", isAuthenticated, jobsRouter);

export default router;
