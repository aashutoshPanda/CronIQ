import Job from "../models/job.js";

/**
 * @desc Create a new job
 * @route POST /api/jobs
 */
export const createJob = async (req, res) => {
  try {
    const { code, timeoutSeconds, executionStartTime, cron } = req.body;

    // Create the job
    const job = await Job.create({
      code,
      timeoutSeconds,
      executionStartTime,
      cron,
      userId: req.user.id,
    });

    return res.status(201).json({ job });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create the job." });
  }
};

/**
 * @desc Get all jobs
 * @route GET /api/jobs
 */
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    return res.json({ jobs });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch jobs." });
  }
};

/**
 * @desc Get a single job by ID
 * @route GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }
    return res.json({ job });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch the job." });
  }
};

/**
 * @desc Update a job by ID
 * @route PUT /api/jobs/:id
 */
export const updateJob = async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Update the job with new values
    const { code, timeoutSeconds, executionStartTime, cron, running, endTime, enabled, pid, userId } = req.body;
    await job.update({
      code,
      timeoutSeconds,
      executionStartTime,
      cron,
      running,
      endTime,
      enabled,
      pid,
      userId,
    });

    return res.json({ job });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update the job." });
  }
};

/**
 * @desc Delete a job by ID
 * @route DELETE /api/jobs/:id
 */
export const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Delete the job
    await job.destroy();

    return res.json({ message: "Job deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete the job." });
  }
};
