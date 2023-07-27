import {connect} from "./index.js"

export async function listenToQueueAndReceive() {
  const { connection, channel, queueName } = await connect();

  try {
    channel.consume(queueName, (message) => {
      if (message !== null) {
        const receivedObject = JSON.parse(message.content.toString());
        console.log('Received object from the queue:', receivedObject);
        channel.ack(message); // Acknowledge that the message was successfully processed.
      }
    });
  } catch (error) {
    console.error('Error listening to the queue:', error);
  }
}
