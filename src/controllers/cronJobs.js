import { CronJob } from "../models";
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
    });
    await scheduleJobsIfApplicable(job);
    // Return the created job as the response
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
};

export const updateJob = async (req, res) => {
  try {
    // Extract job details from the request body
    const { jobId, code, timeoutMilliSeconds, cron, endTime, enabled } = req.body;

    // Find the CronJob by ID
    const job = await CronJob.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Update the job with new details
    job.code = code;
    job.timeoutMilliSeconds = timeoutMilliSeconds;
    job.cron = cron;
    job.endTime = endTime;
    job.enabled = enabled;

    // Save the updated job to the database
    await job.save();

    // Return the updated job as the response
    res.json(job);
  } catch (error) {
    console.error("Error updating job:", error);

    res.status(500).json({ error: "Failed to update job" });
  }
};

export const removeJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the CronJob by ID
    const job = await CronJob.findByPk(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete the job from the database
    await job.destroy();

    // Return a success message as the response
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error removing job:", error);

    res.status(500).json({ error: "Failed to remove job" });
  }
};
