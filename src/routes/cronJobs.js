import express from "express";
import { createJob, deleteJob, getJobById, getJobRuns, patchJob, getAllCronJobs } from "../controllers/cronJobs.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  validateCronJobCreate,
  isCronJobIdValid,
  isUserCreatorCronJob,
  validateCronJobUpdate,
} from "../middlewares/validators.js";

const router = express.Router();

/**
 * @route   GET /api/cron-job/:id
 * @desc    Get details of a specific job by its ID
 * @access  Private
 */
router.get(
  "/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(isCronJobIdValid),
  asyncHandler(isUserCreatorCronJob),
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
  asyncHandler(isCronJobIdValid),
  asyncHandler(isUserCreatorCronJob),
  getJobRuns
);
/**
 * @route   GET /api/cron-jobs
 * @desc    Get a list of all jobs
 * @access  Private
 */
router.get("/", asyncHandler(isAuthenticated), getAllCronJobs);

/**
 * @route   POST /api/cron-job/create
 * @desc    Create a new job
 * @access  Private
 */
router.post("/", asyncHandler(isAuthenticated), validateCronJobCreate, createJob);

/**
 * @route   PATCH /api/cron-job/:id
 * @desc    Update a specific job by its ID
 * @access  Private
 */
router.patch(
  "/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(isCronJobIdValid),
  asyncHandler(isUserCreatorCronJob),
  validateCronJobUpdate,
  patchJob
);

/**
 * @route   DELETE /api/cron-job/:id
 * @desc    Delete a specific job by its ID
 * @access  Private
 */
router.delete(
  "/:id",
  asyncHandler(isAuthenticated),
  asyncHandler(isCronJobIdValid),
  asyncHandler(isUserCreatorCronJob),
  deleteJob
);

// /**
//  * @route   POST /api/cron-job/filter/:status
//  * @desc    Get jobs filtered by their status
//  * @access  Private
//  */
// router.post("/filter/:status", filterJobsByStatus);

export default router;
