import cronParser from "cron-parser";

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

const cronString = "*/15 * * * * *"; // Cron to run every 15 seconds
const startTime = new Date("2023-08-01T00:00:00Z"); // Start time
const oneMinuteLater = new Date("2023-08-01T00:00:00Z");
oneMinuteLater.setMinutes(startTime.getMinutes() + 1);
const endTime = oneMinuteLater; // End time, 1 minute from the current time

const timestamps = findCronJobTimestamps(cronString, startTime, endTime);
console.log(timestamps);
