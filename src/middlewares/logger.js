import fs from "fs";
import path from "path";
import morgan from "morgan";

const currentDir = path.dirname(new URL(import.meta.url).pathname);
const projectRootDir = path.dirname(path.dirname(currentDir));
const logsDir = path.join(projectRootDir, "logs");

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
const loggerMiddleware = () => {
  // Create a write stream for each server startup with a proper name of the log file
  const accessLogStream = fs.createWriteStream(path.join(logsDir, `access-${Date.now()}.log`), { flags: "a" });

  // Return the Morgan middleware with the stream option set to the write stream
  return morgan("combined", { stream: accessLogStream });
};

export default loggerMiddleware;
