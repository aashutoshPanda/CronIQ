import { spawn } from "child_process";
import { updateJobRunDetails } from "../job-runs/index.js";

export const runProcessInBackground = async (jobRun, timeout) => {
  // Get the code from the jobRun object
  const code = jobRun.code;

  // Initialize variables to store stdOut and stdErr
  let stdOut = "";
  let stdErr = "";

  // Spawn a process in the background
  const process = spawn("sh", ["-c", code], {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"], // Redirect stdOut and stdErr to pipes
  });

  // Return the PID of the spawned process
  const pid = process.pid;

  // Listen for data events on stdOut and stdErr streams
  process.stdout.on("data", (data) => {
    stdOut += data.toString();
  });

  process.stderr.on("data", (data) => {
    stdErr += data.toString();
  });

  // Attach a callback to run after the process exits
  process.on("exit", async (exitCode, signal) => {
    // Handle the process exit here
    await updateJobRunDetails({ jobRunId: jobRun.id, exitCode, signal, stdOut, stdErr });
  });

  // Detach the child process to prevent it from being terminated when the parent exits
  // process.unref();

  // Set a timeout to terminate the process if it exceeds the specified timeout value
  setTimeout(async () => {
    if (process.exitCode === null) {
      // If the process is still running after the timeout, terminate it
      process.kill();
      stdErr += "Process terminated due to timeout.";
      // Timeout will exit with status code 124 if the command reaches the time limit and is timed out.
      await updateJobRunDetails({ jobRunId: jobRun.id, stdOut, stdErr, signal: "timeout", exitCode: 124 });
    }
  }, timeout);

  return pid;
};
