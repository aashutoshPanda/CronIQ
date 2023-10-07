import { connect } from "./index.js";
import { handleJobRun } from "../job-runs/index.js";

export async function listenToQueueAndReceive() {
  const { channel, queueName } = await connect();

  try {
    channel.consume(queueName, async (message) => {
      if (message !== null) {
        const { id, type } = JSON.parse(message.content.toString());
        console.log("Received object from the queue:", { id, type });
        await handleJobRun({ id, type });
        channel.ack(message); // Acknowledge that the message was successfully processed.
      }
    });
  } catch (error) {
    console.error("Error listening to the queue:", error);
  }
}
