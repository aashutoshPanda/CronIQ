const amqp = require("amqplib")

async function connect() {
  try {
    const connection = await amqp.connect('amqp://localhost'); // Replace 'localhost' with your RabbitMQ server address if it's different.
    const channel = await connection.createChannel();

    const queueName = 'myQueue'; // Replace 'myQueue' with your desired queue name.

    // Assert the queue to make sure it exists.
    await channel.assertQueue(queueName, { durable: false });

    // Return both the connection and the channel to be used in subsequent steps.
    return { connection, channel, queueName };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

module.exports = connect;