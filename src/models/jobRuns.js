import sequelize from "../helpers/sequelize.js";
import { JobTypes } from "../constants.js"; // Importing job types constants from constants.js

const JobRun = sequelize.define("JobRun", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  jobType: {
    type: DataTypes.ENUM(...Object.values(JobTypes)), // Use constants for ENUM values
    allowNull: false,
  },
  pid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("running", "success", "failed"), // Define valid status values
    allowNull: true,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  stdOut: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  stdErr: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  exitCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("JobRun table created successfully!");
  })
  .catch((error) => {
    console.error("Failed to create JobRun table: ", error);
  });

export default JobRun;
