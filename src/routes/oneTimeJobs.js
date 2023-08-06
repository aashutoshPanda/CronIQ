import express from "express";
import { createJob, deleteJob, getJobRuns, getAllJobs, getJobById } from "../controllers/oneTimeJobs.js";
import { validateOneTimeJobCreate, isOneTimeJobIdValid, isUserCreatorOneTimeJob } from "../middlewares/validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @route   GET api/one-time-job/:id
 * @desc    Get details of a specific job by its ID
 * @access  Private
 */
router.get(
  "/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(isOneTimeJobIdValid),
  asyncHandler(isUserCreatorOneTimeJob),
  getJobById
);

/**
 * @route   GET /api/cron-job/runs/:id
 * @desc    Get all the job runs of this job
 * @access  Private
 */
router.get(
  "/runs/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(isOneTimeJobIdValid),
  asyncHandler(isUserCreatorOneTimeJob),
  getJobRuns
);

/**
 * @route   GET api/one-time-job/
 * @desc    GET all one-time-jobs
 * @access  Private
 */
router.get("/", asyncHandler(isAuthenticated), getAllJobs);

/**
 * @route   POST api/one-time-job/
 * @desc    Create a new one-time job
 * @access  Private
 */
router.post("/", asyncHandler(isAuthenticated), validateOneTimeJobCreate, createJob);

/**
 * @route   DELETE api/one-time-job/:id
 * @desc    Delete a specific job by its ID
 * @access  Private
 */
router.delete(
  "/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(isOneTimeJobIdValid),
  asyncHandler(isUserCreatorOneTimeJob),
  deleteJob
);

export default router;
