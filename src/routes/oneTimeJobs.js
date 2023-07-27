import express from "express";
import {
  createJob,
  deleteJob,
  filterJobsByStatus,
  getAllJobs,
  getJobById,
  updateJob,
} from "../controllers/oneTimeJobs.js";

const router = express.Router();

/**
 * @route   GET /api/jobs/:id
 * @desc    Get details of a specific job by its ID
 * @access  Private
 */
router.get("/:id", getJobById);

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
router.post("/create", createJob);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update a specific job by its ID
 * @access  Private
 */
router.put("/:id", updateJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete a specific job by its ID
 * @access  Private
 */
router.delete("/:id", deleteJob);

/**
 * @route   POST /api/jobs/filter/:status
 * @desc    Get jobs filtered by their status
 * @access  Private
 */
router.post("/filter/:status", filterJobsByStatus);

export default router;
