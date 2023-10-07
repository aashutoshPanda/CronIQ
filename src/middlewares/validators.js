import { cronJobSchemaCreate, oneTimeJobSchemaCreate, cronJobSchemaUpdate } from "../validation-schemas/index.js";
import { CronJob, OneTimeJob } from "../models/index.js";

export const validateCronJobCreate = async (req, res, next) => {
  try {
    const jobData = {
      code: req.body.code || "", // Empty string if code is not provided
      timeoutMilliSeconds: req.body.timeoutMilliSeconds,
      cron: req.body.cron,
      endTime: new Date(req.body.endTime),
      userId: req.user.id,
    };

    await cronJobSchemaCreate.validate(jobData, { abortEarly: false });
    req.validatedJobData = jobData;
    next();
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ error: "Invalid request body", details: error.errors });
  }
};

export const validateOneTimeJobCreate = async (req, res, next) => {
  try {
    const jobData = {
      timeoutMilliSeconds: req.body.timeoutMilliSeconds,
      code: req.body.code,
      userId: req.user.id,
    };

    await oneTimeJobSchemaCreate.validate(jobData, { abortEarly: false });
    req.validatedJobData = jobData;
    next();
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ error: "Invalid request body", details: error.errors });
  }
};

export const validateCronJobUpdate = async (req, res, next) => {
  try {
    const jobData = {
      code: req.body.code,
      timeoutMilliSeconds: req.body.timeoutMilliSeconds,
      cron: req.body.cron,
      userId: req.user.id,
    };

    await cronJobSchemaUpdate.validate(jobData, { abortEarly: false });
    req.validatedJobData = jobData;
    next();
  } catch (error) {
    // Handle validation errors
    res.status(400).json({ error: "Invalid request body", details: error.errors });
  }
};
export const isCronJobIdValid = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find the CronJob by ID
    const job = await CronJob.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    // Check if the job is already deleted
    if (job.isDeleted) {
      return res.status(400).json({ error: "This job is already deleted" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Error while finding job in middleware" });
  }
};

export const isOneTimeJobIdValid = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find the CronJob by ID
    const job = await OneTimeJob.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    // Check if the job is already deleted
    if (job.isDeleted) {
      return res.status(400).json({ error: "This job is already deleted" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Error while finding job in middleware" });
  }
};

export const isUserCreatorOneTimeJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find the CronJob by ID
    const job = await OneTimeJob.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    // Check if the job is already deleted
    if (job.isDeleted) {
      return res.status(400).json({ error: "This job is already deleted" });
    }
    if (!job.userId === req.user.id) {
      return res.status(403).json({ error: "You are not authorised for this job" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Error while finding job in middleware" });
  }
};

export const isUserCreatorCronJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find the CronJob by ID
    const job = await CronJob.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    // Check if the job is already deleted
    if (job.isDeleted) {
      return res.status(400).json({ error: "This job is already deleted" });
    }
    if (!job.userId === req.user.id) {
      return res.status(403).json({ error: "You are not authorised for this job" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Error while finding job in middleware" });
  }
};
