import { pushObjectToQueue } from "../services/message-brokers/publishers.js";
import { OneTimeJob, JobRun } from "../models/index.js";
import { JobTypes, JobRunStatuses } from "../constants/index.js";

/**
 * Controller function to create a new job.
 */
export const createJob = async (req, res) => {
  try {
    // Extract job details from the request body
    const { code, timeoutMilliSeconds } = req.body;

    // Create the job in the database
    const job = await OneTimeJob.create({
      code,
      timeoutMilliSeconds,
      userId: req.user.id,
    });

    // Push the job ID to the queue
    await pushObjectToQueue({ id: job.id, type: JobTypes.OneTimeJob }); // Replace this with the actual function to add the job to the queue

    // Return the created job as the response
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);

    res.status(500).json({ error: "Failed to create job" });
  }
};

/**
 * Controller function to delete a job by its ID.
 */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the CronJob by ID
    const job = await OneTimeJob.findByPk(id);
    // Set isDeleted to true and save the job
    job.isDeleted = true;
    await job.save();

    // Return a success message as the response
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error removing job:", error);
    res.status(500).json({ error: "Failed to remove job" });
  }
};

/**
 * Controller function to get a job by its ID.
 */
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find the job by its ID
    const job = await OneTimeJob.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error getting job by ID:", error);
    res.status(500).json({ error: "Failed to get job" });
  }
};

/**
 * Controller function to get a list of all jobs.
 */
export const getAllJobs = async (req, res) => {
  try {
    // Get all jobs from the database
    const jobs = await OneTimeJob.findAll();

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error getting all jobs:", error);
    res.status(500).json({ error: "Failed to get jobs" });
  }
};

/**
 * Controller function to filter jobs by their status.
 */
export const filterJobsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    // Find all jobs with the specified status
    const jobs = await OneTimeJob.findAll({
      where: {
        status,
      },
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error filtering jobs by status:", error);
    res.status(500).json({ error: "Failed to filter jobs" });
  }
};
