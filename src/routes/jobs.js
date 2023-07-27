import express from "express";
import { getSeats, getJobsByCityAndDate, bookSeatForJob } from "../controllers/jobs.js";

const router = express.Router();

/**
 * @route   GET /api/jobs/:city/:date
 * @desc    Get details of jobs in a city
 * @access  Private
 */
router.get("/:city/:date", getJobsByCityAndDate);

/**
 * @route   GET /api/jobs/:id
 * @desc    GET available seats for a job
 * @access  Private
 */
router.post("/:id", getSeats);

/**
 * @route   POST /api/jobs/:id
 * @desc    Book seats for a particular job
 * @access  Private
 */
router.post("/:id", bookSeatForJob);

export default router;
