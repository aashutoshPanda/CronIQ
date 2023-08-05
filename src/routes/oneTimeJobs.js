import express from "express";
import { createJob, deleteJob, filterJobsByStatus, getAllJobs, getJobById } from "../controllers/oneTimeJobs.js";
import { validateOneTimeJobCreate, isOneTimeJobIdValid, isUserCreatorOneTimeJob } from "../middlewares/validators.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @route   GET /api/jobs/:id
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
 * @route   POST /api/jobs/list
 * @desc    Get a list of all jobs
 * @access  Private
 */
router.post("/list", getAllJobs);

/**
 * @route   POST /api/jobs/create
 * @desc    Create a new job
 * @access  Private
 */
router.post("/", asyncHandler(isAuthenticated), validateOneTimeJobCreate, createJob);

/**
 * @route   DELETE /api/jobs/:id
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

/**
 * @route   POST /api/jobs/filter/:status
 * @desc    Get jobs filtered by their status
 * @access  Private
 */
router.post("/filter/:status", filterJobsByStatus);

export default router;
