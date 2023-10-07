import sequelize from "../helpers/sequelize.js";
import { DataTypes } from "sequelize";
import { User } from "./index.js";

const DEFAULT_JOB_TIMEOUT_MS = 10 * 1000;

const CronJob = sequelize.define("CronJob", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timeoutMilliSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: DEFAULT_JOB_TIMEOUT_MS,
  },
  cron: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

// Add the relationship with User model
User.hasMany(CronJob, {
  foreignKey: "userId",
});

sequelize
  .sync()
  .then(() => {
    console.log("Job table created successfully!");
  })
  .catch((error) => {
    console.error("Job to create table : ", error);
  });

export default CronJob;
