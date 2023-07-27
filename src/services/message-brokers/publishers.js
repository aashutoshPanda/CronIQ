import { connect } from './index.js';

export const pushObjectToQueue = async (obj) => {
  const { connection, channel, queueName } = await connect();

  try {
    const message = JSON.stringify(obj);
    channel.sendToQueue(queueName, Buffer.from(message));

    console.log('Object sent to the queue:', obj);
  } catch (error) {
    console.error('Error pushing to the queue:', error);
  } finally {
    await channel.close();
    await connection.close();
  }
};