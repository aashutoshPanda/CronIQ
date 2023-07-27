import sequelize from "../helpers/sequelize.js";
import { DataTypes } from "sequelize";
import { JobTypes } from "../constants/index.js";

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
    type: DataTypes.ENUM(JobTypes.OneTimeJob, JobTypes.CronJob),
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
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
