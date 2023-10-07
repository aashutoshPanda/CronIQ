export const JobTypes = {
  OneTimeJob: "OneTimeJob",
  CronJob: "CronJob",
};

export const JobRunStatuses = {
  running: "running",
  failed: "failed",
  success: "success",
};

export const TASK_QUEUE_NAME = "tasks-queue";
export const TIME_FOR_ADVANCE_CRON_RUNS_MS = 1000 * 60 * 1;
