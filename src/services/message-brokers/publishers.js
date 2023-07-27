import { connect } from "./index.js";

export const pushObjectToQueue = async ({ id, type }) => {
  const { connection, channel, queueName } = await connect();

  try {
    const message = JSON.stringify({ id, type });
    channel.sendToQueue(queueName, Buffer.from(message));

    console.log("Job sent to the queue:", { id, type });
  } catch (error) {
    console.error("Error pushing to the queue:", error);
  } finally {
    await channel.close();
    await connection.close();
  }
};
