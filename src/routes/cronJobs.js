import express from "express";
import { createJob, deleteJob, getJobById, patchJob } from "../controllers/cronJobs.js";
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
 * @route   GET /api/jobs/:id
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

// /**
//  * @route   POST /api/jobs/list
//  * @desc    Get a list of all jobs
//  * @access  Private
//  */
// router.post("/list", getAllJobs);

/**
 * @route   POST /api/jobs/create
 * @desc    Create a new job
 * @access  Private
 */
router.post("/", asyncHandler(isAuthenticated), validateCronJobCreate, createJob);

/**
 * @route   PATCH /api/jobs/:id
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
 * @route   DELETE /api/jobs/:id
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
//  * @route   POST /api/jobs/filter/:status
//  * @desc    Get jobs filtered by their status
//  * @access  Private
//  */
// router.post("/filter/:status", filterJobsByStatus);

export default router;
