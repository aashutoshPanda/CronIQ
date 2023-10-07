import { OneTimeJob, CronJob, JobRun } from "../models/index.js";
import { deleteQueue } from "../services/message-brokers/index.js";
import { redisManager } from "../services/crons/redis.js";

async function clearSQLite() {
  try {
    await CronJob.destroy({ where: {} }); // Deletes all records from CronJob table
    await OneTimeJob.destroy({ where: {} }); // Deletes all records from OneTimeJob table
    await JobRun.destroy({ where: {} }); // Deletes all records from JobRun table

    console.log("All models cleared successfully!");
  } catch (error) {
    console.error("Error clearing models:", error);
  }
}

export async function resetDataStores() {
  await clearSQLite();
  await deleteQueue();
  await redisManager.clearAll();
}
