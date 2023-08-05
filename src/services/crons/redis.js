import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { JobTypes } from "../../constants/index.js";
import { pushObjectToQueue } from "../message-brokers/publishers.js";

class RedisManager {
  constructor() {
    // Replace the connection details with your actual Redis configuration
    this.redisSubscriber = new Redis({
      host: "localhost",
      port: 6379,
    });

    this.redisPublisher = new Redis({
      host: "localhost",
      port: 6379,
    });

    // Enable the keyevent notification for the subscriber
    this.redisSubscriber.config("SET", "notify-keyspace-events", "Ex");

    // Subscribe to the expiration event channel
    this.redisSubscriber.subscribe("__keyevent@0__:expired");
    this.redisSubscriber.on("message", async (channel, message) => {
      if (channel === "__keyevent@0__:expired") {
        await this.handleExpiredJobRun(message);
      }
    });
  }

  async addJobRun(jobId, startTimeMS) {
    const currentTime = Date.now(); // this is MS since epoch

    if (startTimeMS <= currentTime) {
      console.log(`Job run with ID "${jobId}" has already elapsed.`);
      return;
    }

    // console.log({ jobId, startTime });
    // Create the new string with the 'id' and UUID suffix
    const uuid = uuidv4();
    const redisJobId = `${jobId}-${uuid}`;
    console.log({ currentTime, startTimeMS });
    const expirationTimeSeconds = Math.floor((startTimeMS - currentTime) / 1000);
    console.log({ expirationTimeSeconds });
    await this.redisPublisher.setex(
      redisJobId,
      expirationTimeSeconds,
      JSON.stringify({ type: JobTypes.CronJob, id: jobId })
    );
  }

  async removeJob(job) {
    const redisJobIdPrefix = `${job.id}`;
    // Get all keys from Redis matching the given jobIdPrefix
    const keys = await this.redisPublisher.keys(`${redisJobIdPrefix}*`);

    if (keys.length === 0) {
      console.log(`No jobs found with jobId prefix "${redisJobIdPrefix}".`);
      return;
    }

    // Delete all keys found with the given prefix
    const deletedKeysCount = await this.redisPublisher.del(keys);
    console.log(`Deleted ${deletedKeysCount} jobs with jobId prefix "${redisJobIdPrefix}".`);
  }

  async handleExpiredJobRun(redisJobId) {
    console.log(`Job run with ID "${redisJobId}" has expired.`);
    const jobId = redisJobId.split("-")[0];
    // Your logic to handle the expired job run goes here
    await pushObjectToQueue({ id: jobId, type: JobTypes.CronJob });
  }
}

// Usage example:
export const redisManager = new RedisManager();
