import amqp from "amqplib";
import { TASK_QUEUE_NAME } from "../../constants/index.js";

export async function connect() {
  try {
    const connection = await amqp.connect("amqp://localhost"); // Replace 'localhost' with your RabbitMQ server address if it's different.
    const channel = await connection.createChannel();

    const queueName = TASK_QUEUE_NAME; // Replace 'myQueue' with your desired queue name.

    // Assert the queue to make sure it exists.
    await channel.assertQueue(queueName, { durable: false });

    // Return both the connection and the channel to be used in subsequent steps.
    return { connection, channel, queueName };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
}

// Function to delete the queue in RabbitMQ
export const deleteQueue = async () => {
  try {
    const { connection, channel, queueName } = await connect();

    // Delete the queue
    await channel.deleteQueue(queueName);

    console.log("Queue deleted successfully.");

    // Close the channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error deleting queue:", error.message);
  }
};
