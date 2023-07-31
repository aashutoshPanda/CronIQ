import { TIME_FOR_ADVANCE_CRON_RUNS_MS } from "../../constants";
import cronParser from "cron-parser";
import { redisManager } from "./redis";

export function findCronJobTimestamps(cronString, startTime, endTime) {
  try {
    const options = {
      currentDate: startTime,
      endDate: endTime,
      iterator: true, // Use iterator to get the next timestamps
    };

    const interval = cronParser.parseExpression(cronString, options);
    const timestamps = [];

    while (true) {
      const nextTimestamp = interval.next();

      if (nextTimestamp.done) {
        break;
      }

      timestamps.push(nextTimestamp.value.toISOString()); // Use nextTimestamp.value directly
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
function addMillisecondsToDate(date, millisecondsToAdd) {
  const timestamp = date.getTime() + millisecondsToAdd;
  return new Date(timestamp);
}

export const scheduleJobsIfApplicable = async (job) => {
  const startTime = Date.now();
  const endTimeOfCurrentRedisJobBatch = addMillisecondsToDate(startTime, TIME_FOR_ADVANCE_CRON_RUNS_MS);
  const endTime = findEarlierDate(job.endTime, endTimeOfCurrentRedisJobBatch);
  const timestampsForJob = findCronJobTimestamps(job.cron, startTime, endTime);

  if (timestampsForJob.length === 0) {
    return;
  }

  try {
    const promises = timestampsForJob.map((timestamp) => redisManager.addJobRun(job.id, timestamp));
    await Promise.all(promises);
    console.log("All jobs have been added to redis.");
  } catch (error) {
    console.error("Error while adding jobs at redis", error);
  }
};
