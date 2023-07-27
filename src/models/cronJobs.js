import sequelize from "../helpers/sequelize.js";
import { DataTypes } from "sequelize";
import { User } from "./index.js";

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
  timeoutSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cron: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
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
