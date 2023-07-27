import {connect} from "./index.js"

const QUEUE_NAME = 'testQueue';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pushItemsToQueue() {
  try {
    const connection = await amqp.connect('amqp://localhost'); // Replace 'localhost' with your RabbitMQ server address if it's different.
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });

    const itemsToAdd = [1, 2, 3];

    for (const item of itemsToAdd) {
      const message = JSON.stringify({ id: item });
      channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
      console.log(`Item ${item} added to the queue.`);
      await sleep(5000); // Delay of 5 seconds before adding the next item.
    }

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error pushing items to the queue:', error);
  }
}

async function fetchAndLogItemsFromQueue() {
  try {
    const connection = await amqp.connect('amqp://localhost'); // Replace 'localhost' with your RabbitMQ server address if it's different.
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });

    channel.consume(QUEUE_NAME, (message) => {
      if (message !== null) {
        const item = JSON.parse(message.content.toString());
        console.log(`Received item from the queue: ${item.id}`);
        channel.ack(message); // Acknowledge that the message was successfully processed.
        sleep(5000); // Delay of 5 seconds before processing the next item.
      }
    });
  } catch (error) {
    console.error('Error fetching items from the queue:', error);
  }
}

// Call the functions sequentially to add items to the queue and then fetch them.
pushItemsToQueue()
  .then(() => fetchAndLogItemsFromQueue())
  .catch((error) => console.error('Error:', error));
