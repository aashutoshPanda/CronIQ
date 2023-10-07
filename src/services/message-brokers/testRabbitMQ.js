import { pushObjectToQueue } from "./publishers.js";
import { listenToQueueAndReceive } from "./subscribers.js";

const QUEUE_NAME = "testQueue";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pushItemsToQueue() {
  try {
    const itemsToAdd = [1, 2, 3];
    for (const item of itemsToAdd) {
      await pushObjectToQueue({ id: item });
      console.log(`Item ${item} added to the queue.`);
      await sleep(5000); // Delay of 5 seconds before adding the next item.
    }
  } catch (error) {
    console.error("Error pushing items to the queue:", error);
  }
}

async function fetchAndLogItemsFromQueue() {
  try {
    await listenToQueueAndReceive();
  } catch (error) {
    console.error("Error fetching items from the queue:", error);
  }
}

// Call the functions sequentially to add items to the queue and then fetch them.
pushItemsToQueue()
  .then(() => fetchAndLogItemsFromQueue())
  .catch((error) => console.error("Error:", error));
