import { TIME_FOR_ADVANCE_CRON_RUNS_MS } from "../../constants/index.js";
import cronParser from "cron-parser";
import { redisManager } from "./redis.js";
import { CronJob } from "../../models/index.js";

export function findCronJobTimestamps(cronString, startTime, endTime) {
  try {
    const options = {
      currentDate: startTime,
      endDate: endTime,
      iterator: true, // Use iterator to get the next timestamps
    };

    console.log("findCronJobTimestamps", { cronString, startTime, endTime });

    const interval = cronParser.parseExpression(cronString, options);
    const timestamps = [];

    while (true) {
      const nextTimestamp = interval.next();

      if (nextTimestamp.done) {
        break;
      }

      const dateString = nextTimestamp.value.toISOString();
      const millisecondsSinceEpoch = Date.parse(dateString);
      timestamps.push(millisecondsSinceEpoch); // Use nextTimestamp.value directly
    }

    return timestamps;
  } catch (error) {
    console.error("Error parsing cron:", error);
    return [];
  }
}

function findEarlierDate(date1, date2) {
  if (date1 < date2) {
    return date1;
  } else {
    return date2;
  }
}
function addMillisecondsToDate(dateMsSinceEpoch, millisecondsToAdd) {
  const timestamp = dateMsSinceEpoch + millisecondsToAdd;
  return new Date(timestamp);
}

export const scheduleJobsIfApplicable = async (job) => {
  const startTime = Date.now(); // this returns milliseconds since epoch
  const endTimeOfCurrentRedisJobBatch = addMillisecondsToDate(startTime, TIME_FOR_ADVANCE_CRON_RUNS_MS);
  const endTime = findEarlierDate(job.endTime, endTimeOfCurrentRedisJobBatch);
  const timestampsMSSinceEpochsForJob = findCronJobTimestamps(job.cron, startTime, endTime);

  if (timestampsMSSinceEpochsForJob.length === 0) {
    return;
  }
  try {
    const promises = timestampsMSSinceEpochsForJob.map((timestampMS) => redisManager.addJobRun(job.id, timestampMS));
    await Promise.all(promises);
    console.log("All jobs have been added to redis.");
  } catch (error) {
    console.error("Error while adding jobs at redis", error);
  }
};

export const handleCronUpdateForJob = async (job) => {
  await redisManager.removeJob(job);
  await scheduleJobsIfApplicable(job);
};

export async function getAllEnabledJobsAndSchedule() {
  try {
    const allJobs = await CronJob.findAll({ where: { enabled: true } });

    const currentTime = Date.now();

    for (const job of allJobs) {
      if (job.endTime >= currentTime) {
        // Call the function to schedule the job
        scheduleJobsIfApplicable(job);
      } else {
        // If the job's end time is passed, disable the job and save it back to the model
        job.enabled = false;
        await job.save();
      }
    }
  } catch (error) {
    console.error("Error occurred while processing jobs:", error);
  }
}

// Call getAllEnabledJobsAndSchedule() initially and then set an interval to call it every 1000 milliseconds
export async function startJobScheduler() {
  await getAllEnabledJobsAndSchedule();
  setInterval(getAllEnabledJobsAndSchedule, TIME_FOR_ADVANCE_CRON_RUNS_MS);
}
