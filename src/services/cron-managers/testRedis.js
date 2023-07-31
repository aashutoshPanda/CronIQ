import Redis from "ioredis";

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
    this.redisSubscriber.on("message", (channel, message) => {
      if (channel === "__keyevent@0__:expired") {
        this.handleExpiredJobRun(message);
      }
    });
  }

  addJobRun(jobRun) {
    const { id, startTime } = jobRun;
    const currentTime = new Date();

    if (startTime <= currentTime) {
      console.log(`Job run with ID "${id}" has already elapsed.`);
      return;
    }

    const expirationTimeSeconds = Math.floor((startTime - currentTime) / 1000);
    this.redisPublisher.setex(id, expirationTimeSeconds, JSON.stringify(jobRun));
  }

  handleExpiredJobRun(id) {
    console.log(`Job run with ID "${id}" has expired.`);
    // Your logic to handle the expired job run goes here
  }
}

// Usage example:
const redisManager = new RedisManager();

// Suppose you have a jobRun object with an ID and startTime, you can add it like this:
const currentDate = new Date();
const futureDate = new Date(currentDate.getTime() + 5000);
const jobRun = {
  id: "jobRun1",
  startTime: futureDate,
};
redisManager.addJobRun(jobRun);
