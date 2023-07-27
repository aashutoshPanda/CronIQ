import sequelize from "../helpers/sequelize.js";
import { DataTypes } from "sequelize";
import { User } from "./index.js";

const DEFAULT_JOB_TIMEOUT_MS = 10 * 1000;
const OneTimeJob = sequelize.define("OneTimeJob", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timeoutSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: DEFAULT_JOB_TIMEOUT_MS,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM("running", "finished", "submitted"),
    allowNull: false,
    defaultValue: "submitted", // Default value for status will be "submitted"
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

// Add the relationship with User model
User.hasMany(OneTimeJob, {
  foreignKey: "userId",
});

sequelize
  .sync()
  .then(() => {
    console.log("OneTimeJob table created successfully!");
  })
  .catch((error) => {
    console.error("Failed to create OneTimeJob table : ", error);
  });

export default OneTimeJob;
