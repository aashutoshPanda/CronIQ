import { CronJob } from "../models/index.js";
import { scheduleJobsIfApplicable } from "../services/crons/index.js";

export const createJob = async (req, res) => {
  try {
    // Extract job details from the request body
    const { code, timeoutMilliSeconds, cron, endTime } = req.body;

    // Create the job in the database
    const job = await CronJob.create({
      code,
      timeoutMilliSeconds,
      cron,
      endTime,
      userId: req.user.id,
    });
    await scheduleJobsIfApplicable(job);
    // Return the created job as the response
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
};

export const patchJob = async (req, res) => {
  try {
    // Extract job details from the request body

    const { id } = req.params;
    const { code, timeoutMilliSeconds, cron, endTime } = req.body;

    // Find the CronJob by ID
    const job = await CronJob.findByPk(id);

    // Define an object with the request body properties and their corresponding job properties
    const updateFields = {
      code,
      timeoutMilliSeconds,
      cron,
      endTime,
    };

    // Update the job with new details, but only if they are present in the request body
    for (const [key, value] of Object.entries(updateFields)) {
      if (value !== undefined) {
        job[key] = value;
      }
    }

    // Save the updated job to the database
    await job.save();

    // Return the updated job as the response
    res.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Failed to update job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the CronJob by ID
    const job = await CronJob.findByPk(id);

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
    const job = await CronJob.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error getting job by ID:", error);
    res.status(500).json({ error: "Failed to get job" });
  }
};
