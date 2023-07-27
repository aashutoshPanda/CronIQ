import sequelize from "../helpers/sequelize.js";
import { pushObjectToQueue } from "../services/message-brokers/publishers.js";
import { OneTimeJob } from "../models/index.js";

/**
 * Controller function to create a new job.
 */
export const createJob = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Extract job details from the request body
    const { code, timeoutSeconds } = req.body;

    // Create the job in the database within the transaction
    const job = await OneTimeJob.create(
      {
        code,
        timeoutSeconds,
      },
      { transaction: t }
    );

    // Add the job ID to the queue
    await pushObjectToQueue({ id: job.id, type: "OneTimeJob" }); // Replace this with the actual function to add the job to the queue

    // Commit the transaction after the job is successfully added to the queue
    await t.commit();

    // Return the created job as the response
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);

    // Rollback the transaction in case of an error
    await t.rollback();

    res.status(500).json({ error: "Failed to create job" });
  }
};

/**
 * Controller function to update a job by its ID.
 */
export const updateJob = async (req, res) => {
  try {
    // Extract job details to update from the request body
    const { code, timeoutSeconds, startTime, enabled, status } = req.body;

    // Get the job by its ID
    const jobId = req.params.id;
    const job = await OneTimeJob.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Update the job properties
    job.code = code;
    job.timeoutSeconds = timeoutSeconds;
    job.startTime = startTime;
    job.enabled = enabled;
    job.status = status;

    // Save the updated job to the database
    await job.save();

    // Return the updated job as the response
    res.status(200).json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
};

/**
 * Controller function to delete a job by its ID.
 */
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find the job by its ID
    const job = await OneTimeJob.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete the job
    await job.destroy();

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Failed to delete job" });
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
