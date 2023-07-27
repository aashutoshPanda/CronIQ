import sequelize from "../helpers/sequelize.js";
import { JobTypes, JobRunStatuses } from "../constants/index.js"; // Importing job types constants from constants.js
import { DataTypes } from "sequelize";
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
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(JobRunStatuses.running, JobRunStatuses.success, JobRunStatuses.failed), // Define valid status values
    allowNull: true,
    defaultValue: JobRunStatuses.running,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
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
