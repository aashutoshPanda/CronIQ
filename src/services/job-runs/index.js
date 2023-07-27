import { JobRun } from "../../models/index.js";
import { CronJob, OneTimeJob } from "../../models/index.js";
import { JobTypes } from "../../constants/index.js";
import { runProcessInBackground } from "../processes/index.js";

export const initJobRun = async ({ id, type, code }) => {
  try {
    // Create the JobRun entry in the database
    const jobRun = await JobRun.create({
      jobId: id,
      jobType: type, // Use the provided job type
      code,
    });

    return jobRun;
  } catch (error) {
    console.error("Error creating JobRun:", error);
    throw new Error("Failed to create JobRun");
  }
};

export const addPidToJobRun = async (jobRunId, pid) => {
  try {
    // Find the JobRun with the given jobRunId from the database
    const jobRun = await JobRun.findByPk(jobRunId);

    if (!jobRun) {
      throw new Error("JobRun not found.");
    }

    // Update the PID of the JobRun with the provided PID
    jobRun.pid = pid;

    // Save the updated JobRun back to the database
    await jobRun.save();

    console.log("PID added to JobRun successfully:", jobRun.toJSON());
    return jobRun.toJSON();
  } catch (error) {
    console.error("Error adding PID to JobRun:", error.message);
    throw error;
  }
};

export const updateJobRunDetails = async ({ jobRunId, exitCode, signal, stdOut, stdErr }) => {
  try {
    // Find the JobRun with the given jobRunId from the database
    const jobRun = await JobRun.findByPk(jobRunId);

    if (!jobRun) {
      throw new Error("JobRun not found.");
    }

    // Update the JobRun details with the provided exitCode, signal, stdOut, and stdErr
    jobRun.exitCode = exitCode;
    jobRun.signal = signal;
    jobRun.stdOut = stdOut;
    jobRun.stdErr = stdErr;
    jobRun.status = exitCode === 0 ? "success" : "failed"; // Assuming 0 exit code means success

    // Set the endTime to the current time
    jobRun.endTime = new Date();

    // Save the updated JobRun back to the database
    await jobRun.save();

    console.log("JobRun details updated successfully:", jobRun.toJSON());
    return jobRun.toJSON();
  } catch (error) {
    console.error("Error updating JobRun details:", error.message);
    throw error;
  }
};

export async function handleJobRun({ id, type }) {
  // Got the Job from DB
  let job;
  if (type === JobTypes.CronJob) {
    job = await CronJob.findByPk(id);
  } else {
    job = await OneTimeJob.findByPk(id);
  }

  // Made a JobRun in DB
  const jobRun = await initJobRun({ id, type, code: job.code });
  const pid = await runProcessInBackground(jobRun, job.timeoutMilliSeconds);
  await addPidToJobRun(jobRun.id, pid);
}
